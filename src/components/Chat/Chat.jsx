import React, { useState } from "react";
import { motion } from "framer-motion";
import { SlideUp, FadeIn, ScaleUp } from "../../animation/animateExtended";
import { FaVolumeUp } from "react-icons/fa";

// 模拟聊天数据
const initialMessages = [
  {
    id: 1,
    sender: "ai",
    text: "Hi,Kevin!It's nice to meet you.How are you today?",
    avatar: "/src/assets/brand/1.png",
  },
  {
    id: 2,
    sender: "user",
    text: "I'm good,and how are you?",
    avatar: "/src/assets/brand/2.png",
    grammar: "I want to talk to you about Harry Potter.",
    grammarNote: "这句话的正确说法应该是：I want to talk to you about Harry Potter.",
    aiAnalysis: "暂无AI润色数据",
  },
  {
    id: 3,
    sender: "ai",
    text: "I'm good too,thanks.This coffee shop is cozy, isn't it?",
    avatar: "/src/assets/brand/1.png",
  },
  {
    id: 4,
    sender: "user",
    text: "Yeah, it's a great cave, and you are very pretty today.",
    avatar: "/src/assets/brand/2.png",
    grammar: "I have seen the movies but not read the books.",
    grammarNote: "这句话的正确说法应该是：I have seen the movies but not read the books.",
    aiAnalysis: "暂无AI润色数据",
  },
  {
    id: 5,
    sender: "ai",
    text: "Thank you, Kevin. That's very kind of you to say. Do you come here often?",
    avatar: "/src/assets/brand/1.png",
  },
  {
    id: 6,
    sender: "user",
    text: "Now this is my first time here. What would you like to drink?",
    grammar: "I have seen the movies but not read the books.",
    grammarNote: "这句话的正确说法应该是：I have seen the movies but not read the books.",
    aiAnalysis: "暂无AI润色数据",
  }
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [activeTab, setActiveTab] = useState("对话详情");
  const [inputText, setInputText] = useState("");
  const [showGrammar, setShowGrammar] = useState({});

  const handleSend = () => {
    if (!inputText.trim()) return;

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

    // 模拟AI回复
    setTimeout(() => {
      const newAiMessage = {
        id: messages.length + 2,
        sender: "ai",
        text: "That's okay! The books are really cool, but the movies are amazing too. Which movie was your favorite?",
        avatar: "/src/assets/brand/1.png",
      };
      setMessages((prev) => [...prev, newAiMessage]);
    }, 1000);
  };

  const toggleGrammar = (id) => {
    setShowGrammar((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-gray-50 py-32 w-full relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-20 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="container max-w-4xl mx-auto">
        {/* 标题区域 */}
        <div className="flex flex-col justify-center items-center mb-12 text-center">
          <motion.div
            variants={FadeIn(0.1)}
            initial="initial"
            whileInView="animate"
            className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full mb-6"
          >
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">智能对话 · 语言学习</span>
          </motion.div>
          <motion.h2
            variants={SlideUp(0.2)}
            initial="initial"
            whileInView="animate"
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
          >
            口语报告
          </motion.h2>
        </div>

        {/* 选项卡 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-sm p-1 flex">
            {["对话成绩", "对话详情"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 聊天界面 */}
        <motion.div
          variants={ScaleUp(0.3)}
          initial="initial"
          whileInView="animate"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 max-h-[600px] overflow-y-auto">
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
                placeholder="输入你想说的内容..."
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                发送
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;