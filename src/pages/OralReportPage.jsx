import React, { useState, useEffect, useRef } from "react";
import { FaVolumeUp, FaCheck, FaArrowRight, FaTimes } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SlideUp, FadeIn, ScaleUp, BounceIn } from "../animation/animateExtended";

// 添加Google字体链接
import { Helmet } from "react-helmet";


// 导入头像
import CatherineAvatar from "../assets/catherine.svg";
import UserAvatar from "../assets/user.svg";

// 导入API服务
import { fetchAIDialogs, fetchUserDialogs, fetchGrammarCorrections, sendUserReply } from "../services/dialogApi";

// 模拟对话数据 - 每组对话包含Catherine的问题和用户的回答，作为一个卡片展示
// 注意：这里使用静态数据模拟后端返回的数据，实际项目中应该从API获取
const initialDialogs = [
  {
    id: 1,
    ai: {
      sender: "ai",
      name: "Catherine",
      text: "Hi Kevin! It's nice to meet you. How are you today?",
      avatar: CatherineAvatar,
    },
    user: {
      sender: "user",
      name: "Me",
      text: "I'm good, and how are you?",
      avatar: UserAvatar,
      grammar: "I'm good, and how are you?",
      grammarNote: "语法正确",
      aiPolish: "暂无AI润色数据"
    }
  },
  {
    id: 2,
    ai: {
      sender: "ai",
      name: "Catherine",
      text: "I'm good too, thanks. This coffee shop is cozy, isn't it?",
      avatar: CatherineAvatar,
    },
    user: {
      sender: "user",
      name: "Me",
      text: "Yeah, it's a great cafe, and you are very pretty today.",
      avatar: UserAvatar,
      
      grammarNote: "无语法错误",
      aiPolish: "Yeah, this café has such a nice vibe, and you're looking absolutely lovely today!",
     
    }
  },
  {
    id: 3,
    ai: {
      sender: "ai",
      name: "Catherine",
      text: "Thank you, Kevin. That's very kind of you to say. Do you come here often?",
      avatar: CatherineAvatar,
    },
    user: {
      sender: "user",
      name: "Me",
      text: "Now this is my first time here. What would you like to drink?",
      avatar: UserAvatar,
    
      grammarNote: "无语法错误",
      aiPolish: "Actually, it's my first time here. What can I get you to drink?"
    },

  },

];

const OralReportPage = () => {
  // 添加字体样式
  const [dialogs, setDialogs] = useState(initialDialogs);
  const [activeTab, setActiveTab] = useState("对话详情");
  // 语法检错内容默认展示，不再需要控制展开状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogCompleted, setDialogCompleted] = useState(true);  // 对话默认已完成
  const [dialogScore, setDialogScore] = useState(85);  // 对话得分
  const [roundsCompleted, setRoundsCompleted] = useState(5);  // 完成的对话轮数
  
  // 单词选择和拖拽相关状态
  const [selectedWords, setSelectedWords] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDragWord, setCurrentDragWord] = useState(null);
  const dragWordRef = useRef(null);
  
  // 获取对话数据
  useEffect(() => {
    const getDialogsData = async () => {
      setLoading(true);
      try {
        // 实际项目中应该从API获取数据
        // 目前使用静态数据模拟，注释掉API调用代码
        /*
        const aiDialogs = await fetchAIDialogs();
        const userDialogs = await fetchUserDialogs();
        
        // 合并AI和用户对话数据
        const combinedDialogs = aiDialogs.map((aiDialog, index) => {
          return {
            id: aiDialog.id,
            ai: aiDialog,
            user: userDialogs[index] || {
              sender: "user",
              name: "Me",
              text: "",
              avatar: UserAvatar,
              grammar: "",
              grammarNote: "",
              aiPolish: ""
            }
          };
        });
        
        setDialogs(combinedDialogs);
        */
        
        // 使用静态数据
        setDialogs(initialDialogs);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch dialogs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    getDialogsData();
  }, []);
  
  // 获取对话数据的函数保留，但移除发送回复相关的函数
  
  // 语法检错内容默认展示，不再需要控制展开/折叠状态
  // 保留API调用相关注释，以便将来实现
  
  // 处理单词选择
  const handleWordSelect = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      // 确保是单词（不包含空格）
      if (!/\s/.test(selectedText) && selectedText.length <= 20) {
        setCurrentDragWord({
          id: Date.now(),
          text: selectedText
        });
        setIsDragging(true);
      }
    }
  };
  
  // 处理拖拽开始
  const handleDragStart = (e) => {
    if (currentDragWord) {
      // 创建一个自定义的拖拽图像
      const dragImage = document.createElement('div');
      dragImage.className = 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm';
      dragImage.textContent = currentDragWord.text;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      e.dataTransfer.setData('text/plain', currentDragWord.text);
      e.dataTransfer.effectAllowed = 'copy';
      
      dragWordRef.current = dragImage;
    }
  };
  
  // 处理拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false);
    setCurrentDragWord(null);
    
    // 移除拖拽图像
    if (dragWordRef.current) {
      document.body.removeChild(dragWordRef.current);
      dragWordRef.current = null;
    }
  };
  
  // 处理拖拽放置
  const handleDrop = (e) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    
    if (word && !selectedWords.some(w => w.text === word)) {
      setSelectedWords([...selectedWords, {
        id: Date.now(),
        text: word
      }]);
    }
    
    setIsDragging(false);
    setCurrentDragWord(null);
  };
  
  // 处理拖拽悬停
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  // 移除已选中的单词
  const removeSelectedWord = (id) => {
    setSelectedWords(selectedWords.filter(word => word.id !== id));
  };
  /*
  // 获取语法纠错数据的函数
  const fetchGrammarData = (dialogId) => {
    // 显示加载状态
    setDialogs(prevDialogs => 
      prevDialogs.map(dialog => 
        dialog.id === dialogId 
          ? { 
              ...dialog, 
              user: { 
                ...dialog.user, 
                grammarNote: "正在加载语法检错数据..."
              } 
            }
          : dialog
      )
    );
    
    fetchGrammarCorrections(dialogId).then(data => {
      // 更新对话中的语法纠错数据
      setDialogs(prevDialogs => 
        prevDialogs.map(dialog => 
          dialog.id === dialogId 
            ? { 
                ...dialog, 
                user: { 
                  ...dialog.user, 
                  grammar: data.grammar || dialog.user.grammar,
                  grammarNote: data.grammarNote || dialog.user.grammarNote,
                  aiPolish: data.aiPolish || dialog.user.aiPolish
                } 
              }
            : dialog
        )
      );
    }).catch(err => {
      console.error('Failed to fetch grammar corrections:', err);
      // 显示错误信息
      setDialogs(prevDialogs => 
        prevDialogs.map(dialog => 
          dialog.id === dialogId 
            ? { 
                ...dialog, 
                user: { 
                  ...dialog.user, 
                  grammarNote: "获取语法检错数据失败，请重试"
                } 
              }
            : dialog
        )
      );
    });
  }
  */

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden py-20 font-roboto">
      {/* 背景装饰 */}
      <div className="absolute top-20 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          {/* 主内容区域 */}
          <div className="w-full">
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
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 font-poppins"
          >
            口语报告
          </motion.h2>
          <Link to="/chat" className="text-gray-600 hover:text-gray-800 flex items-center gap-1 mt-2">
            <IoChevronBack size={16} />
            <span>返回对话</span>
          </Link>
        </div>

        {/* 选项卡 - 仅在对话完成后显示 */}
        {dialogCompleted && (
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
        )}

        {/* 对话完成后的报告 */}
        {dialogCompleted && activeTab === "对话成绩" && (
          <motion.div
            variants={ScaleUp(0.3)}
            initial="initial"
            whileInView="animate"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
          >
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-gray-500 mb-2">对话结束，以下是你本次的对话报告</div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 font-poppins">对话报告</h3>
              </div>
              
              {/* 对话时间、开口次数、使用单词数统计 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">3<span className="text-sm font-normal">分</span>34<span className="text-sm font-normal">秒</span></div>
                  <div className="text-xs text-gray-500 mt-1">对话时间</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">5</div>
                  <div className="text-xs text-gray-500 mt-1">开口次数</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">49</div>
                  <div className="text-xs text-gray-500 mt-1">使用单词</div>
                </div>
              </div>
              
              {/* 用词分布 */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <span className="text-xs text-green-600">✓</span>
                  </div>
                  <h4 className="text-base font-medium text-gray-800">用词分布</h4>
                </div>
                
                <div className="flex items-center justify-between">
                  {/* 饼图 */}
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      {/* 小学词汇 51% */}
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="5"
                        strokeDasharray="51, 100"
                        strokeLinecap="round"
                      />
                      {/* 初中词汇 12% */}
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="5"
                        strokeDasharray="12, 100"
                        strokeDashoffset="-51"
                        strokeLinecap="round"
                      />
                      {/* 高中词汇 8% */}
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="5"
                        strokeDasharray="8, 100"
                        strokeDashoffset="-63"
                        strokeLinecap="round"
                      />
                      {/* 其他 29% */}
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="5"
                        strokeDasharray="29, 100"
                        strokeDashoffset="-71"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  
                  {/* 图例 */}
                  <div className="flex-1 pl-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-xs text-gray-600">小学 51%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-xs text-gray-600">初中 12%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-xs text-gray-600">高中 8%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-xs text-gray-600">其他 29%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 对话评价 */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-xs text-blue-600">📊</span>
                  </div>
                  <h4 className="text-base font-medium text-gray-800">对话评价</h4>
                </div>
                
                <div className="space-y-4">
                  {/* 对话流畅度 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">对话流畅度</span>
                      <span className="text-xs text-gray-600">5/5分</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  {/* 对话熟练度 */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">对话熟练度</span>
                      <span className="text-xs text-gray-600">4/5分</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 评语 */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="text-base font-medium text-gray-800 mb-3 font-poppins">流畅度评语</h4>
                <p className="text-sm text-gray-700 mb-4 font-noto">
                  用户回复流畅，能够很好地理解和回应AI机器人的问题。
                </p>
                
                <h4 className="text-base font-medium text-gray-800 mb-3 font-poppins">熟练度评语</h4>
                <p className="text-sm text-gray-700 font-noto">
                  用户对话熟练度较好的掌握，能够提供相关的信息和回答。
                </p>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setActiveTab("对话详情")} 
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  查看对话详情
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 对话详情内容区域 - 卡片式布局 */}
        {(activeTab === "对话详情" || !dialogCompleted) && (
          <div className="flex gap-6 font-noto">
            {/* 左侧对话内容 */}
            <motion.div
              variants={ScaleUp(0.3)}
              initial="initial"
              whileInView="animate"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1"
            >
            {/* 命令行风格的头部 */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="text-white text-sm ml-2 font-poppins">SmartPaper AI 口语对话</div>
            </div>
            
            {/* 对话完成提示 */}
            {dialogCompleted && (
              <div className="bg-green-50 p-4 border-b border-green-100">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <FaCheck className="text-green-500" />
                  <span>对话已完成！你可以查看对话报告了</span>
                </div>
              </div>
            )}
            
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {/* 加载状态 */}
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {/* 错误提示 */}
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                  {error}
                  <button 
                    onClick={() => window.location.reload()} 
                    className="ml-2 underline"
                  >
                    重试
                  </button>
                </div>
              )}
              
              {/* 对话卡片列表 */}
              {!loading && !error && dialogs.map((dialog) => (
                <motion.div 
                  key={dialog.id} 
                  variants={ScaleUp(0.3)}
                  initial="initial"
                  whileInView="animate"
                  className="mb-8 last:mb-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* 卡片头部 */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-600">对话 #{dialog.id}</div>
                  </div>
                  
                  {/* 卡片内容 */}
                  <div className="p-5">
                    {/* AI问题部分 */}
                    <div className="mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                          <img 
                            src={dialog.ai.avatar} 
                            alt={dialog.ai.name} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-lg font-poppins">{dialog.ai.name}</div>
                          <div className="mt-1 p-4 bg-gray-50 rounded-lg font-roboto">{dialog.ai.text}</div>
                          
                          {/* 播放按钮 */}
                          <div className="mt-2 flex justify-end">
                            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                              <FaVolumeUp className="text-gray-500" />
                              <span className="sr-only">播放</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 用户回答部分 */}
                    {dialog.user.text ? (
                      <div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                            <img 
                              src={dialog.user.avatar} 
                              alt={dialog.user.name} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-lg font-poppins">{dialog.user.name}</div>
                            <div 
                              className="mt-1 p-4 text-gray-800 bg-gray-50 rounded-lg font-roboto" 
                              onMouseUp={handleWordSelect}
                            >
                              {dialog.user.text}
                              {currentDragWord && isDragging && (
                                <span 
                                  draggable="true"
                                  onDragStart={handleDragStart}
                                  onDragEnd={handleDragEnd}
                                  className="hidden"
                                >
                                  {currentDragWord.text}
                                </span>
                              )}
                            </div>
                            
                            {/* 语法检错与AI润色 - 默认展示 */}
                            <div className="mt-2">
                              <div className="flex items-center gap-1 text-sm text-orange-500 font-medium">
                              
                              </div>
                              
                              <div className="mt-2 p-3 bg-orange-50 rounded-lg text-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-block w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
                                    <span className="text-xs">🔍</span>
                                  </span>
                                  <span className="font-medium text-orange-600">语法检错</span>
                                </div>
                                <div className="text-gray-700">{dialog.user.grammar}</div>
                                <div className="mt-2 text-gray-600">
                              
                                  
                                  {dialog.user.grammarNote}
                                </div>
                              </div>
                              
                              {/* AI润色部分 */}
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="inline-block w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-xs">✨</span>
                                  </span>
                                  <span className="font-medium text-blue-600">AI润色</span>
                                </div>
                                <div className="text-gray-600">{dialog.user.aiPolish}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 italic">等待回复...</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* 底部输入区域已移除 */}
          </motion.div>
          
          {/* 右侧单词展示区域 */}
          <motion.div
            variants={ScaleUp(0.4)}
            initial="initial"
            whileInView="animate"
            className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
              <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="text-white text-sm ml-2">单词收集</div>
              </div>
              
              <div className="p-4">
                <div className="text-center text-sm text-gray-500 mb-4">
                  {selectedWords.length > 0 ? 
                    "拖拽单词到此处收集" : 
                    "从左侧对话中选择单词并拖到此处收集"}
                </div>
                
                {/* 已选择的单词列表 */}
                <div className="space-y-2">
                  {selectedWords.map(word => (
                    <div 
                      key={word.id} 
                      className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-blue-800 font-medium">{word.text}</span>
                      <button 
                        onClick={() => removeSelectedWord(word.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {selectedWords.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => setSelectedWords([])} 
                      className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      清空所有
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OralReportPage;