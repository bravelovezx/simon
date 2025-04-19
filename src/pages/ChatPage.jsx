import React, { useState } from "react";
import { motion } from "framer-motion";
import { SlideUp, FadeIn, ScaleUp } from "../animation/animateExtended";
import { FaVolumeUp, FaArrowRight, FaPlus, FaSearch, FaHistory, FaUser, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import SceneSelector from "../components/Chat/SceneSelector";

// 模拟聊天数据
const initialMessages = [
  {
    id: 1,
    sender: "ai",
    text: "Hi Kevin! It's nice to meet you. How are you today?",
    avatar: "/src/assets/catherine.svg",
  },
  {
    id: 2,
    sender: "user",
    text: "I'm good, and how are you?",
    avatar: "/src/assets/user.svg",
  },
  {
    id: 3,
    sender: "ai",
    text: "I'm good too, thanks. This coffee shop is cozy, isn't it?",
    avatar: "/src/assets/catherine.svg",
  },
  {
    id: 4,
    sender: "user",
    text: "Yeah, it's a great cave, and you are very pretty today.", 
    avatar: "/src/assets/user.svg",
  },  
  {
    id: 5,
    sender: "ai",
    text: "Thank you, Kevin. That's very kind of you to say. Do you come here often?",
    avatar: "/src/assets/catherine.svg",
  },
  {
    id: 6,
    sender: "user",
    text: "Now this is my first time here. What would you like to drink?",
    avatar: "/src/assets/user.svg",
  }
];

// 模拟历史对话数据
const chatHistory = [
  {
    id: 1,
    title: "咖啡馆闲聊",
    date: "2025-04-17",
    preview: "通过沉浸式咖啡馆闲聊提升英语口语能力"
  },
  {
    id: 2,
    title: "哈利波特电影讨论",
    date: "2025-03-10",
    preview: "聊了最喜欢的哈利波特电影..."
  },
  {
    id: 3,
    title: "旅行计划讨论",
    date: "2025-03-05",
    preview: "讨论了暑假旅行计划..."
  }
];

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages);
  const [activeTab, setActiveTab] = useState("对话详情");
  const [inputText, setInputText] = useState("");
  const [showGrammar, setShowGrammar] = useState({});
  const [sending, setSending] = useState(false);
  const [dialogCompleted, setDialogCompleted] = useState(false);
  const [roundsCount, setRoundsCount] = useState(0);
  const [maxRounds] = useState(5); // 最大对话轮数
  const [searchText, setSearchText] = useState(""); // 搜索文本
  const [activeChatId, setActiveChatId] = useState(null); // 当前活跃的聊天ID
  const [showSceneSelector, setShowSceneSelector] = useState(false); // 场景选择器显示状态

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 生成报告并跳转
  const handleGenerateReport = () => {
    // 这里可以添加生成报告的逻辑，例如调用API等
    // 然后跳转到口语报告页面
    navigate("/oral-report");
  };
  
  const handleSend = () => {
    if (!inputText.trim() || sending) return;

    setSending(true);
    
    // 添加用户消息
    const newUserMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputText,
      avatar: "/src/assets/brand/2.png",
      grammar: inputText, // 简化示例，实际应该有语法检查
      grammarNote: "语法正确",
      aiAnalysis: "暂无AI润色数据",
    };

    setMessages([...messages, newUserMessage]);
    setInputText("");
    
    // 更新对话轮数
    const newRoundsCount = roundsCount + 1;
    setRoundsCount(newRoundsCount);

    // 模拟AI回复
    setTimeout(() => {
      // 根据对话轮数生成不同的回复
      let aiReply = "";
      
      switch(newRoundsCount) {
        case 1:
          aiReply = "I'm good too, thanks. This coffee shop is cozy, isn't it?";
          break;
        case 2:
          aiReply = "Thank you, Kevin. That's very kind of you to say. Do you come here often?";
          break;
        case 3:
          aiReply = "I think I'll have a latte. What about you?";
          break;
        case 4:
          aiReply = "We've had a great conversation. Is there anything else you'd like to talk about?";
          break;
        case 5:
          aiReply = "This has been a wonderful chat! I think we've covered quite a lot today.";
          break;
        default:
          aiReply = "Please continue, I'm listening.";
      }

      const newAiMessage = {
        id: messages.length + 2,
        sender: "ai",
        text: aiReply,
        avatar: "/src/assets/catherine.svg",
      };

      setMessages((prev) => [...prev, newAiMessage]);
      setSending(false);

      // 如果达到最大对话轮数，显示对话完成提示
      if (newRoundsCount >= maxRounds) {
        setTimeout(() => {
          setDialogCompleted(true);
        }, 1000);
      }
    }, 1000);
  };

  const toggleGrammar = (id) => {
    setShowGrammar((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 relative">
      {/* 背景装饰 */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-40 right-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="flex h-screen pt-16 pb-0 px-4 md:px-8 lg:px-12">
        {/* 侧边栏 */}
        <div className="w-64 bg-gray-900 text-white rounded-l-xl overflow-hidden flex-shrink-0 hidden md:block">
          {/* 侧边栏头部 */}
          <div className="p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <FaUser className="text-white text-xs" />
              </div>
              <span className="font-medium">Kimi</span>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <FaCog className="text-gray-400 text-sm" />
            </button>
          </div>

          {/* 新建聊天按钮 */}
          <div className="p-4">
            <button 
              onClick={() => setShowSceneSelector(true)}
              className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus className="text-xs" />
              <span>新建聊天</span>
            </button>
          </div>

          {/* 搜索框 */}
          <div className="px-4 mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="搜索..."
                className="w-full bg-gray-800 text-white text-sm rounded-lg py-2 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs" />
            </div>
          </div>

          {/* 历史对话列表 */}
          <div className="px-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            <div className="text-xs text-gray-500 px-2 py-1 uppercase">历史对话</div>
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${activeChatId === chat.id ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <FaHistory className="text-gray-400 text-xs" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-medium text-sm truncate">{chat.title}</div>
                    <div className="text-gray-500 text-xs truncate">{chat.preview}</div>
                    <div className="text-gray-600 text-xs mt-1">{chat.date}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 聊天主区域 */}
        <div className="flex-1 flex flex-col bg-white rounded-r-xl overflow-hidden shadow-sm border border-gray-100">
          {/* 命令行风格的头部 */}
          <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="text-white text-sm ml-2">Simon AI 口语对话</div>
          </div>
          
          {/* 对话完成提示 */}
          {dialogCompleted && (
            <motion.div
              variants={ScaleUp(0.3)}
              initial="initial"
              animate="animate"
              className="bg-green-50 border-b border-green-100 p-4 text-center"
            >
              <div className="text-green-600 font-medium mb-2">恭喜！您已完成本次对话练习</div>
              <p className="text-gray-600 mb-4 text-sm">现在您可以生成口语报告，查看您的对话表现和语法分析。</p>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <span>生成口语报告</span>
                <FaArrowRight className="text-xs" />
              </button>
            </motion.div>
          )}
          
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="mb-8 last:mb-0">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={message.avatar}
                      alt={message.sender === "ai" ? "Catherine" : "Me"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-lg">
                      {message.sender === "ai" ? "Catherine" : "Me"}
                    </div>
                    <div className="mt-1">{message.text}</div>

                    {message.sender === "user" && (
                      <div className="mt-2">
                        <button
                          onClick={() => toggleGrammar(message.id)}
                          className="flex items-center gap-1 text-sm text-orange-500 font-medium"
                        >
                          <span className="inline-block w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-xs">🔍</span>
                          </span>
                          语法检错
                        </button>

                        {showGrammar[message.id] && (
                          <div className="mt-2 p-3 bg-orange-50 rounded-lg text-sm">
                            <div className="text-gray-700">{message.grammar}</div>
                            <div className="mt-2 text-gray-600">
                              <span className="font-medium">- 提示：</span>
                              <br />
                              {message.grammarNote}
                            </div>
                            <div className="mt-2">
                              <span className="inline-block w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs">🔮</span>
                              </span>
                              <span className="ml-1 font-medium text-blue-600">AI润色</span>
                              <div className="mt-1 text-gray-600">{message.aiAnalysis}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {message.sender === "ai" && (
                    <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <FaVolumeUp className="text-gray-500" />
                      <span className="sr-only">播放</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 输入区域 */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="准备好提问了吗？我随时可以开始聊天！"
                disabled={dialogCompleted || sending}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSend}
                disabled={dialogCompleted || sending || !inputText.trim()}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${dialogCompleted || sending || !inputText.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-md"}`}
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>发送中...</span>
                  </>
                ) : (
                  <span>发送</span>
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right">
              对话进度: {roundsCount}/{maxRounds} 轮
            </div>
          </div>
        </div>
      </div>
      <Footer className="mt-auto" />

      {/* 场景选择弹窗 */}
      <SceneSelector
        isOpen={showSceneSelector}
        onClose={() => setShowSceneSelector(false)}
        onSelect={(sceneId) => {
          // 处理场景选择
          console.log('Selected scene:', sceneId);
          // 这里可以添加根据场景初始化对话的逻辑
        }}
      />
    </div>
  );
};

export default ChatPage;