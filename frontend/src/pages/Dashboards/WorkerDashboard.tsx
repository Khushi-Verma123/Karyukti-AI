import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Send,
  Cpu,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  FileText,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  GitCommit
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  goal: string;
  description: string;
  instructions: string;
  tools: string[];
}

interface Message {
  sender: 'user' | 'agent';
  content: string;
  timestamp: string;
  reasoningSteps?: string[];
  reasoningPlan?: string[];
  agentTrace?: Array<{ agent: string; action: string; result: string }>;
}

export const WorkerDashboard: React.FC = () => {
  const { token, user, geminiApiKey } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [reasoningOpen, setReasoningOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Speech
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setQuery(text);
      };

      recognitionRef.current = rec;
    }

    // Load initial agents
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/agents', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const deployed = data.filter((a: any) => a.isDeployed);
          setAgents(deployed);
          if (deployed.length > 0) {
            setSelectedAgentId(deployed[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to get agents:', err);
      }
    };

    fetchAgents();
  }, [token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const [sessions, setSessions] = useState<{id: string; timestamp: string; messages: Message[]}[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  useEffect(() => {
    if (selectedAgentId) {
      const stored = localStorage.getItem(`karyukti_sessions_${selectedAgentId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSessions(parsed);
          if (parsed.length > 0) {
            setCurrentSessionId(parsed[0].id);
            setMessages(parsed[0].messages);
          } else {
            startNewSession();
          }
        } catch (e) {
          startNewSession();
        }
      } else {
        startNewSession();
      }
    }
  }, [selectedAgentId]);

  const startNewSession = () => {
    const newId = Date.now().toString();
    setCurrentSessionId(newId);
    setMessages([]);
  };

  useEffect(() => {
    if (selectedAgentId && currentSessionId) {
      setSessions(prev => {
        const existingIdx = prev.findIndex(s => s.id === currentSessionId);
        let newSessions = [...prev];
        if (existingIdx >= 0) {
          newSessions[existingIdx].messages = messages;
        } else {
          newSessions.unshift({
            id: currentSessionId,
            timestamp: new Date().toLocaleString(),
            messages
          });
        }
        // Only keep sessions with messages
        newSessions = newSessions.filter(s => s.messages.length > 0 || s.id === currentSessionId);
        localStorage.setItem(`karyukti_sessions_${selectedAgentId}`, JSON.stringify(newSessions));
        return newSessions;
      });
    }
  }, [messages, currentSessionId, selectedAgentId]);

  const toggleListen = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#`_\-]/g, ''); // strip markdown formatting characters
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const activeAgent = agents.find(a => a.id === selectedAgentId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !selectedAgentId || loading) return;

    const userText = query;
    setQuery('');
    setErrorMsg('');

    // Append user message
    const userMsg: Message = {
      sender: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          agentId: selectedAgentId,
          query: userText,
          geminiApiKey
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || data.error || 'Failed to communicate with agent');
        
        // Append error system message
        setMessages(prev => [...prev, {
          sender: 'agent',
          content: `⚠️ [Einstein Trust Layer Error] ${data.message || data.error || 'Request blocked.'}`,
          timestamp: new Date().toLocaleTimeString()
        }]);
      } else {
        const agentMsg: Message = {
          sender: 'agent',
          content: data.output,
          timestamp: new Date().toLocaleTimeString(),
          reasoningSteps: data.steps,
          reasoningPlan: data.plan,
          agentTrace: data.agentTrace
        };
        setMessages(prev => [...prev, agentMsg]);

        // Auto read response aloud if microphone was used
        if (speechSupported && 'speechSynthesis' in window) {
          handleSpeak(data.output);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to reach backend server.');
    } finally {
      setLoading(false);
    }
  };

  // Get last agent response to render steps
  const lastAgentMsg = [...messages].reverse().find(m => m.sender === 'agent' && m.reasoningSteps);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-fade-in">
      {/* Chat Column */}
      <div className="flex-1 bg-bg-secondary border border-borderColor rounded-3xl flex flex-col overflow-hidden h-full">
        {/* Selector Header */}
        <div className="p-4 border-b border-borderColor/60 flex items-center justify-between gap-4 bg-bg-primary/20 shrink-0">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" />
            <select
              value={selectedAgentId}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="bg-transparent text-xs font-bold text-text-primary focus:outline-none cursor-pointer max-w-[200px]"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id} className="bg-bg-secondary text-text-primary text-xs">
                  🤖 {agent.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currentSessionId}
              onChange={e => {
                const targetId = e.target.value;
                setCurrentSessionId(targetId);
                const targetSession = sessions.find(s => s.id === targetId);
                if (targetSession) setMessages(targetSession.messages);
              }}
              className="bg-transparent text-[10px] text-text-secondary border border-borderColor rounded px-2 py-1 focus:outline-none cursor-pointer max-w-[150px]"
            >
              <option value={currentSessionId}>Current Chat</option>
              {sessions.filter(s => s.id !== currentSessionId && s.messages.length > 0).map(s => (
                <option key={s.id} value={s.id}>
                  {s.timestamp}
                </option>
              ))}
            </select>
            <button
              onClick={startNewSession}
              className="text-[10px] text-brand-600 hover:text-brand-500 font-bold border border-brand-500/30 bg-brand-500/10 px-2 py-1 rounded cursor-pointer transition-colors"
            >
              + New Chat
            </button>
            {activeAgent && (
              <div className="text-[10px] text-text-secondary truncate max-w-[150px]">
                Goal: {activeAgent.goal}
              </div>
            )}
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-600 mb-4 animate-bounce">
                🤖
              </div>
              <h4 className="font-bold text-xs text-text-primary">
                Agent: {activeAgent?.name || 'Karyukti AI'} is ready
              </h4>
              <p className="text-[10px] text-text-secondary mt-1 max-w-sm">
                Ask a question, query CRM items, generate leads report, or toggle speech features.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col max-w-[80%] ${
                m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-brand-500 text-white rounded-br-none shadow-md shadow-brand-500/10'
                    : 'bg-bg-tertiary border border-borderColor/60 text-text-primary rounded-bl-none'
                }`}
              >
                {/* Format basic markdown bullet points */}
                <div className="space-y-1.5 whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1 px-1.5">
                <span className="text-[9px] text-text-muted">{m.timestamp}</span>
                {m.sender === 'agent' && (
                  <button
                    onClick={() => handleSpeak(m.content)}
                    className="p-1 hover:bg-bg-tertiary rounded-lg text-brand-600 transition-colors"
                    title="Speak answer"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-bg-tertiary border border-borderColor/40 mr-auto max-w-[120px]">
              <RefreshCw className="w-3.5 h-3.5 text-brand-600 animate-spin" />
              <span className="text-[10px] text-text-secondary font-medium">Thinking...</span>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-borderColor/60 flex items-center gap-2 bg-bg-primary/20 shrink-0">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={loading}
            placeholder={`Instruct ${activeAgent?.name || 'Agent'}...`}
            className="flex-1 bg-bg-primary/60 border border-borderColor rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-500 disabled:opacity-50"
          />

          {speechSupported && (
            <button
              type="button"
              onClick={toggleListen}
              className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                isListening
                  ? 'bg-red-500 border-red-500 text-white animate-pulse'
                  : 'bg-bg-primary border-borderColor text-text-secondary hover:text-text-primary'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-50 disabled:bg-brand-500/60 shadow-md shadow-brand-500/10 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Atlas Reasoning Panel (Collapsible) */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col h-full bg-bg-secondary border border-borderColor rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-borderColor/60 bg-bg-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs font-bold text-text-primary">Atlas Engine Trace</h3>
          </div>
          <span className="text-[9px] bg-brand-500/10 text-brand-600 font-bold px-2 py-0.5 rounded-full">
            Realtime ADK
          </span>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {!lastAgentMsg ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-muted p-4">
              <FileText className="w-8 h-8 mb-2 opacity-40" />
              <span className="text-[10px]">Reasoning trail will update upon sending instructions.</span>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Planning Section */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                  Decomposed Subtasks
                </h4>
                <div className="space-y-1 bg-bg-primary p-3 rounded-xl border border-borderColor">
                  {lastAgentMsg.reasoningPlan?.map((step, idx) => (
                    <div key={idx} className="text-[10px] text-text-primary">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Steps */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                  Step-by-Step Thought process
                </h4>
                <div className="space-y-2">
                  {lastAgentMsg.reasoningSteps?.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-bg-tertiary/60 border-l-2 border-brand-500 text-[9px] text-text-primary"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Agent Collaboration Trace */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                  ADK Multi-Agent Sync
                </h4>
                <div className="space-y-2">
                  {lastAgentMsg.agentTrace?.map((trace, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-bg-primary border border-borderColor text-[9px]">
                      <div className="flex items-center justify-between font-bold text-text-primary">
                        <span>🤖 {trace.agent}</span>
                        <span className="text-brand-600 bg-brand-500/10 px-1 rounded">{trace.action}</span>
                      </div>
                      <div className="text-text-secondary mt-1">{trace.result}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
