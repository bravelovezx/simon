import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp, FadeIn, ScaleUp, BounceIn } from "../../animation/animateExtended"; // Assuming these are defined correctly
import { FaArrowRight, FaFileUpload, FaRobot, FaListAlt, FaBook } from "react-icons/fa";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// --- Mock Data ---
const flowSteps = [
  { id: 1, title: "上传作文", description: "粘贴文本或上传文档", icon: <FaFileUpload className="text-xl" />, color: "from-purple-400 to-blue-400", },
  { id: 2, title: "选择优化点", description: "选择关注的优化方面", icon: <FaListAlt className="text-xl" />, color: "from-blue-400 to-indigo-400", },
  { id: 3, title: "AI优化", description: "AI自动分析并优化作文", icon: <FaRobot className="text-xl" />, color: "from-indigo-400 to-purple-400", },
];

const userGoal = `Long Holidays

Long holidays are usually good for college students. Firstly, we get a lot of time to study on our own. This helps us work on our weak points and improve our strong points. Secondly, we can do part-time jobs. This makes us understand responsibility and prepares us for life after college.

However, there are also bad sides. Some students don’t use their time well. They play computer games too much. I think this might harm them.

For me, I will try to use my holiday time properly. I will study English because I am not good at it. Also, I will work as a part-time teacher. This way, I can make some money and use what I have learned.`;

// Simplified AI response - just the core text
const aiOptimizedText = `Generally speaking, long holidays are good for us college students. On the one hand, we have a lot of time to study by ourselves and thus improve weaknesses and further develop strengths. On the other hand, we can take part-time jobs, which can make us realize responsibility and make ourselves better prepared for social life. But every coin has two sides. Some students fail to make good use of their time and they are addicted to various computer games. I am afraid that they are likely to ruin themselves in this way. As far as I am concerned, I will try to make the best use of my precious time. I will spend most of my holidays studying English for that I am very poor at it. In addition, I will take a part-time job as private teacher. By this means, I can earn some money and put my knowledge into practice as well.`;
const readingTitle = "For Your Coffee Break: Coffee Talk, Coffee Revolution";
const readingText = `The book wanders into many corners of coffee arcana, for better or for worse (be sure to read "The Women's Petition against Coffee" and "THE Mens Answer TO THE Womens Petition AGAINST COFFEE, VINDICATING Their own Performances, and the Vertues of that Liquor, from the Undeserved Aspersions lately cast upon them by their SCANDALOUS PAMPHLET" from seventeenth-century England—they would make Chaucer blush). It waxes rather romantic about the superiority of Italian roasts and concoctions, and it doesn't follow the most logical narrative. But what it lacks in consistency it makes up for in illuminating history. Coffee made its way from Ethiopia to Yemen, evoking medical and philosophical accounts of its properties from some of the most eminent contemporary scholars. From Yemen it spread throughout Mecca and Medina and into Egypt. From Cairo it made its way to Constantinople, following the trajectory of the expansion of the Ottoman Empire. And it was Constantinople's proximity to and commerce with Venice that anointed Italy as coffee's gateway to Europe.

In addition to spates of resistance by Muslim clerics, coffee also met with resistance from the Church, which denounced the beverage as a devil's drink and attempted numerous prohibitions. Eventually however, in a hip move (perhaps presaging Pope Benedict's blessing of Facebook?) Pope Clement VIII sanctified coffee, saying, "We will not let coffee remain the property of Satan. As Christians, our power is greater than Satan's, so we shall make coffee our own." And to complete the Abrahamic trifecta, once coffee was no longer excoriated by the Church, it was a Lebanese Jew who brought coffee to England. He opened the first coffeehouse in Oxford, thus inaugurating the storied relationship between university students and coffee.`;

const highlightedSentences = [
  "But what it lacks in consistency it makes up for in illuminating history.",
  "In addition to spates of resistance by Muslim clerics, coffee also met with resistance from the Church, which denounced the beverage as a devil's drink and attempted numerous prohibitions."
];

const analyzedContent = [
  {
    original: "But what it lacks in consistency it makes up for in illuminating history.",
    analysis: `[转折连词] But\n[宾语从句] what it lacks in consistency\n[主语] it\n[谓语] makes up for\n[方式/范围状语] in illuminating history\n\n翻译：但它在阐明历史方面弥补了一致性的不足。`
  },
  {
    original: "In addition to spates of resistance by Muslim clerics, coffee also met with resistance from the Church, which denounced the beverage as a devil's drink and attempted numerous prohibitions.",
    analysis: `[状语] In addition to spates of resistance by Muslim clerics,\n[主句主语] coffee\n[副词] also\n[主句谓语] met\n[主句宾语] with resistance from the Church,\n    [定语从句] which denounced the beverage as a devil's drink\n                    and attempted numerous prohibitions.\n\n翻译：除了穆斯林神职人员的强烈抵制之外，咖啡还受到了教会的抵制，教会谴责这种饮料是魔鬼的饮料，并多次尝试禁止。`
  }
];

// --- Drag and Drop Setup ---
const ItemTypes = {
  PHRASE: 'phrase',
  SELECTED_TEXT: 'selected_text',
  HIGHLIGHTED_SENTENCE: 'highlighted_sentence'
};

// Draggable component for pre-defined phrases
const DraggablePhrase = ({ text }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PHRASE,
    item: { text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <span
      ref={drag}
      className="cursor-move inline-block bg-blue-100 px-1 rounded mx-px ring-1 ring-blue-200"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {text}
    </span>
  );
};

const DraggableHighlightedSentence = ({ text }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.HIGHLIGHTED_SENTENCE,
    item: { text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <span
      ref={drag}
      className="cursor-move inline-block bg-yellow-100 px-1 rounded mx-px ring-1 ring-yellow-200"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {text}
    </span>
  );
};

// Draggable component for user-selected text
const SelectedTextDraggable = ({ text }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SELECTED_TEXT,
    item: { text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  if (!text) return null;

  return (
    <div className="p-3 border border-dashed border-blue-400 rounded-lg bg-blue-50 shadow-sm">
      <span className="text-sm text-gray-600 block mb-1 font-medium">可拖拽选中内容:</span>
      <span
        ref={drag}
        className="cursor-move inline-block bg-yellow-100 px-3 py-1.5 rounded-lg ring-1 ring-yellow-300 text-sm font-medium line-clamp-2 max-h-12"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {text}
      </span>
    </div>
  );
};

// Drop Zone component
const DropZone = ({ index, droppedText, setDroppedText, handleClear, handleConfirm, showConfirmMsg }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.PHRASE, ItemTypes.SELECTED_TEXT],
    drop: (item) => {
      setDroppedText(index, item.text);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = 'bg-gray-50';
  if (isActive) {
    backgroundColor = 'bg-blue-100';
  } else if (canDrop) {
    backgroundColor = 'bg-blue-50';
  }

  const isConfirming = showConfirmMsg === index;

  return (
    <div
      ref={drop}
      className={`flex items-center gap-2 p-2 border rounded-md transition-colors duration-200 relative ${backgroundColor}`}
      style={{ minHeight: '50px' }}
    >
      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 flex items-center justify-center bg-green-100 rounded-md z-10"
          >
            <span className="text-green-700 font-medium">已记录</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-[100px] border-r pr-2 text-sm">
        {droppedText[index] || <span className="text-gray-400 italic">拖拽内容到此处</span>}
      </div>
      {!isConfirming && (
        <div className="flex gap-1">
          <button
            onClick={() => handleClear(index)}
            className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
            disabled={!droppedText[index]}
            title="清除"
          >
            ✕
          </button>
          <button
            onClick={() => handleConfirm(index)}
            className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs hover:bg-green-600 disabled:opacity-50"
            disabled={!droppedText[index]}
            title="确认"
          >
            ✓
          </button>
        </div>
      )}
    </div>
  );
};

// Reading Drop Zone component
const ReadingDropZone = ({ droppedSentence, setDroppedSentence, index, setSelectedText }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedText, setAnalyzedText] = useState('');

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.HIGHLIGHTED_SENTENCE, ItemTypes.SELECTED_TEXT],
    drop: (item) => {
      setDroppedSentence(index, item.text);
      setIsLoading(true);
      setSelectedText('');
      setTimeout(() => {
        const content = analyzedContent.find(c => c.original === item.text);
        if (content) {
          setAnalyzedText(content.analysis);
        }
        setIsLoading(false);
      }, 2000);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  let backgroundColor = 'bg-gray-50';
  if (isActive) backgroundColor = 'bg-blue-100';
  else if (canDrop) backgroundColor = 'bg-blue-50';

  return (
    <div
      ref={drop}
      className={`flex flex-col p-2 border rounded-md transition-colors duration-200 relative ${backgroundColor} mb-2`}
      style={{ minHeight: '50px' }}
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md z-10"
          >
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 min-w-[100px] text-sm">
        {isLoading ? (
          <span className="text-gray-400 italic">加载中...</span>
        ) : analyzedText ? (
          <pre className="whitespace-pre-wrap text-gray-700 max-h-40 overflow-y-auto">
            {analyzedText}
          </pre>
        ) : droppedSentence[index] ? (
          <span className="text-gray-700 line-clamp-3">{droppedSentence[index]}</span>
        ) : (
          <span className="text-gray-400 italic">拖拽高亮句子到此处</span>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
const AIFlow = () => {
  const [activePage, setActivePage] = useState('essay');
  const [droppedText, setDroppedText] = useState(['', '', '']);
  const [droppedSentences, setDroppedSentences] = useState(['', '']);
  const [selectedText, setSelectedText] = useState('');
  const [showConfirmMsg, setShowConfirmMsg] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [activeAccumulationTab, setActiveAccumulationTab] = useState('words');
  const [showRecommendedText, setShowRecommendedText] = useState(false);
  const [userInput, setUserInput] = useState(''); // 存储用户输入内容
  const [userTitle, setUserTitle] = useState(''); // 新增状态存储用户输入标题
  const [showAiResponse, setShowAiResponse] = useState(false); // 控制AI优化文本显示
  const [isLoading, setIsLoading] = useState(false); // 控制加载动画
  const aiResponseRef = useRef(null);
  const accumulatedWords = ["As far as I am concerned", "By this means",  "wanders into", "concoctions", "contemporary"];
  const accumulatedSentences = ["But what it lacks in consistency it makes up for in illuminating history.", "The narwhal is a deep-sea whale with a tusk on its forehead."];

  const evaluationText = `
Task Response（任务回应）
考生明确回应了题目的主旨——长假对大学生的好处和坏处，并结合自身经历表达了个人看法。内容围绕题目，逻辑完整，涵盖“有利”与“不利”两个方面，最后也给出了自己的计划，符合 Discuss both sides and give your opinion 的要求。

Coherence and Cohesion（语篇连贯与衔接）
文章结构清晰，使用了基本的连接词（如 Firstly, Secondly, However, Also），段落划分合理，思路发展自然。但部分句子之间连接略显生硬，缺乏更丰富的衔接手段。

Lexical Resource（词汇资源）
使用的词汇准确但较为基础，例如 study, part-time jobs, responsibility, computer games 等，表达清楚但缺少词汇的丰富性和灵活性。重复使用 study, part-time，缺少同义词替换或更具体描述。

Grammatical Range and Accuracy（语法多样性与准确性）
语法基本准确，使用了一些复合句（如 because I am not good at it），但整体句型结构较为简单，句式变化不够丰富。多数为简单陈述句，偶有句式略显重复。
`;

  const handleRecommendClick = () => {
    setShowRecommendedText(true); // 点击推荐按钮后显示推荐文本
  };

  const handleSetDroppedText = (index, text) => {
    const newDroppedText = [...droppedText];
    newDroppedText[index] = text;
    setDroppedText(newDroppedText);
  };

  const handleClear = (index) => {
    const newDroppedText = [...droppedText];
    newDroppedText[index] = '';
    setDroppedText(newDroppedText);
    if (showConfirmMsg === index) {
      setShowConfirmMsg(null);
    }
  };

  const handleConfirm = (index) => {
    if (droppedText[index] && showConfirmMsg !== index) {
      setShowConfirmMsg(index);
      setTimeout(() => {
        setShowConfirmMsg(null);
        // Clear the dropped text for this index after confirmation message disappears
        const newDroppedText = [...droppedText];
        newDroppedText[index] = '';
        setDroppedText(newDroppedText);
      }, 1500);
    }
  };

  const handleTextSelection = () => {
    const currentSelection = window.getSelection()?.toString().trim();
    if (currentSelection) {
      setSelectedText(currentSelection);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiResponseRef.current && !aiResponseRef.current.contains(event.target)) {
        if (!event.target.closest('.selected-text-draggable-wrapper')) {
          setSelectedText('');
        }
      }
    };
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);

  const handleSetDroppedSentence = (index, text) => {
    const newDroppedSentences = [...droppedSentences];
    newDroppedSentences[index] = text;
    setDroppedSentences(newDroppedSentences);
  };

  // 新增处理提交用户输入的函数
  const handleSubmit = () => {
    if (userInput.trim() && userTitle.trim()) {
      setIsLoading(true);
      // 模拟加载延迟
      setTimeout(() => {
        setIsLoading(false);
        setShowAiResponse(true);
      }, 1500);
    }
  };

  const draggablePhrases = [

  ];

  const renderAiTextWithDraggables = (text, phrases) => {
    let parts = [text];
    phrases.forEach(phrase => {
      let newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const splitByPhrase = part.split(phrase);
          for (let i = 0; i < splitByPhrase.length; i++) {
            newParts.push(splitByPhrase[i]);
            if (i < splitByPhrase.length - 1) {
              newParts.push(<DraggablePhrase key={`${phrase}-${i}`} text={phrase} />);
            }
          }
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });
    return parts.filter(part => part !== '').map((part, index) => (
      <React.Fragment key={index}>{part}</React.Fragment>
    ));
  };

  const renderReadingTextWithHighlights = useMemo(() => {
    return (text, highlights, droppedSentences) => {
      let parts = [text];
      highlights.forEach((highlight, idx) => {
        if (droppedSentences.includes(highlight)) {
          let newParts = [];
          parts.forEach(part => {
            if (typeof part === 'string') {
              const splitByHighlight = part.split(highlight);
              for (let i = 0; i < splitByHighlight.length; i++) {
                newParts.push(splitByHighlight[i]);
                if (i < splitByHighlight.length - 1) {
                  newParts.push(
                    <span key={`highlight-${idx}-${i}`} className="bg-yellow-200">
                      {highlight}
                    </span>
                  );
                }
              }
            } else {
              newParts.push(part);
            }
          });
          parts = newParts;
        }
      });
      return parts.filter(part => part !== '').map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ));
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <AnimatePresence mode="wait">
        {activePage === 'essay' ? (
          <motion.div
            key="essay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-50 py-32 w-full relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute top-20 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
  
              <div className="container mx-auto px-4">
                {/* Title Area */}
                <div className="flex flex-col justify-center items-center mb-20 text-center max-w-3xl mx-auto">
                  <motion.div
                    variants={FadeIn(0.1)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full mb-6"
                  >
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">智能演示 · 直观体验</span>
                  </motion.div>
                  <motion.h2
                    variants={SlideUp(0.2)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    作文智能优化流程
                  </motion.h2>
                  <motion.div
                    variants={SlideUp(0.3)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6"
                  >
                    <p>三步轻松完成作文的智能分析与优化</p>
                  </motion.div>
                </div>
  
                {/* Flow Steps Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {flowSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      variants={ScaleUp(0.3 + index * 0.1)}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r ${step.color} text-white flex-shrink-0`}>
                          {step.icon}
                        </div>
                        <div className="text-xl font-bold">{step.title}</div>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
  
                {/* Interactive Demo Area */}
                <motion.div
                  variants={FadeIn(0.5)}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-5xl mx-auto"
                >
                  {/* Command-line style header */}
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-white text-sm ml-2 font-mono">作文优化</div>
                  </div>
  
                  {/* User Input Area */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                        <span className="text-sm">用户</span>
                      </div>
                      <div className="flex-1">
                        <motion.div
                          variants={BounceIn(0.2)}
                          initial="initial"
                          whileInView="animate"
                          viewport={{ once: true }}
                          className="font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap"
                        >
                          <span className="text-gray-400 mb-2 block">输入您的作文:</span>
                          {/* 新增标题输入框 */}
                          <div className="mb-3">
                            <input
                              type="text"
                              value={userTitle}
                              onChange={(e) => setUserTitle(e.target.value)}
                              placeholder="作文标题..."
                              className="w-full bg-transparent border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          {/* 内容输入框 */}
                          <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="在此输入您的作文内容..."
                            className="w-full h-40 bg-transparent border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                          />
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={handleSubmit}
                              disabled={!userInput.trim() || !userTitle.trim() || isLoading}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md text-sm flex items-center gap-2 hover:shadow-md transition-all duration-300 disabled:opacity-50"
                            >
                              {isLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>处理中...</span>
                                </>
                              ) : (
                                <>
                                  <span>提交优化</span>
                                  <FaArrowRight className="text-xs" />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
  
                  {/* AI Response Area & Drop Zones */}
                  <div className="p-6 flex flex-col md:flex-row gap-6">
  {/* Left Side: AI Response and Evaluation */}
  <div className="flex-1">
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
        <FaRobot className="text-sm" />
      </div>
      <div className="flex-1">
        {/* AI Optimized Text */}
        <motion.div
          variants={SlideUp(0.3)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="bg-gray-50 p-6 rounded-lg relative mb-4"
        >
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-gray-600">AI优化中...</span>
              </motion.div>
            ) : showAiResponse ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-gray-700 leading-relaxed select-text"
                onMouseUp={handleTextSelection}
                ref={aiResponseRef}
              >
                {renderAiTextWithDraggables(aiOptimizedText, draggablePhrases)}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-400 italic text-center py-10"
              >
                提交您的作文后，AI优化结果将显示在此处
              </motion.div>
            )}
          </AnimatePresence>
          {showAiResponse && (
            <div className="selected-text-draggable-wrapper mt-2">
              <SelectedTextDraggable text={selectedText} />
            </div>
          )}
        </motion.div>

        {/* Evaluation Text */}
        <motion.div
          variants={SlideUp(0.4)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="bg-gray-50 p-6 rounded-lg relative"
        >
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-gray-600">评价生成中...</span>
              </motion.div>
            ) : showAiResponse ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-gray-700 leading-relaxed"
              >
                <h3 className="text-lg font-bold mb-2">作文评价</h3>
                <pre className="whitespace-pre-wrap">{evaluationText}</pre>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-gray-400 italic text-center py-10"
              >
                提交您的作文后，评价将显示在此处
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {showAiResponse && (
          <motion.div
            variants={FadeIn(1.5)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-4 flex justify-end"
          >
            <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm flex items-center gap-2 hover:shadow-md transition-all duration-300">
              <span>获取优化建议</span>
              <FaArrowRight className="text-xs" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  </div>
  
                    {/* Right Side: Drop Zones */}
                    <motion.div
                      variants={FadeIn(0.5)}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 flex-shrink-0"
                    >
                      <p className="text-sm text-gray-500 mb-1 text-center md:text-left">拖拽优化片段至下方:</p>
                      {[0, 1, 2].map((index) => (
                        <DropZone
                          key={index}
                          index={index}
                          droppedText={droppedText}
                          setDroppedText={handleSetDroppedText}
                          handleClear={handleClear}
                          handleConfirm={handleConfirm}
                          showConfirmMsg={showConfirmMsg}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
  
                {/* Switch to Reading and Accumulation Page Buttons */}
                <motion.div
                  className="mt-6 flex justify-center gap-4"
                  variants={FadeIn(0.6)}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <button
                    onClick={() => setActivePage('reading')}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-sm flex items-center gap-2 hover:shadow-md transition-all duration-300"
                  >
                    <FaBook className="text-xs" />
                    <span>阅读功能</span>
                  </button>
                  <button
                    onClick={() => setActivePage('accumulation')}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full text-sm flex items-center gap-2 hover:shadow-md transition-all duration-300"
                  >
                    <FaListAlt className="text-xs" />
                    <span>积累模块</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : activePage === 'reading' ? (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-50 py-32 w-full relative overflow-hidden">
              <div className="absolute top-20 -right-40 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-40 left-20 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

              <div className="container mx-auto px-4">
                {/* Top Bar: URL Input and Button */}
                <motion.div
                  className="flex flex-row items-center gap-4 mb-8 max-w-5xl mx-auto"
                  variants={FadeIn(0.2)}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="输入URL"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleRecommendClick} // 点击按钮触发推荐文本显示
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg text-sm hover:shadow-md transition-all duration-300"
                  >
                    根据对话内容推荐
                  </button>
                </motion.div>

                {/* Main Content Area */}
                <motion.div
                  variants={FadeIn(0.5)}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-5xl mx-auto"
                >
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-white text-sm ml-2 font-mono">阅读功能</div>
                  </div>

                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    {/* Left Side: Reading Text and Drop Zone */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
                          <FaBook className="text-sm" />
                        </div>
                        <div className="flex-1">
                          {/* Upper Text Area with Fixed Height and Scrollbar */}
                          <AnimatePresence>
                            {showRecommendedText ? (
                              <motion.div
                                key="recommended-text"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-50 p-6 rounded-lg mb-4 overflow-y-auto"
                                style={{ height: '300px' }}
                              >
                            <div
                              className="text-gray-1000 leading-relaxed text-xl pr-2 text-center"
                              onMouseUp={handleTextSelection}
                            >
                              {renderReadingTextWithHighlights(readingTitle, highlightedSentences, droppedSentences)}
                            </div>
                                <div
                                  className="text-gray-700 leading-relaxed select-text pr-2"
                                  onMouseUp={handleTextSelection}
                                >
                                  {renderReadingTextWithHighlights(readingText, highlightedSentences, droppedSentences)}
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="placeholder-text"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-50 p-6 rounded-lg mb-4 flex items-center justify-center"
                                style={{ height: '300px' }}
                              >
                                <p className="text-gray-400 italic">点击“根据对话内容推荐”按钮以显示推荐文本</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {/* 独立显示 SelectedTextDraggable */}
                          <div className="selected-text-draggable-wrapper mb-4">
                            <SelectedTextDraggable text={selectedText} />
                          </div>
                          {/* Lower Drop Zone Area (Narrower) */}
                          <motion.div
                            variants={SlideUp(0.4)}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="bg-gray-50 p-2 rounded-lg"
                            style={{ minHeight: '100px' }}
                          >
                            {[0, 1].map(index => (
                              <ReadingDropZone
                                key={index}
                                index={index}
                                droppedSentence={droppedSentences}
                                setDroppedSentence={handleSetDroppedSentence}
                                setSelectedText={setSelectedText}
                              />
                            ))}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    {/* Right Side: Drop Zones for Phrases */}
                    <motion.div
                      variants={FadeIn(0.5)}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 flex-shrink-0"
                    >
                      <p className="text-sm text-gray-500 mb-1 text-center md:text-left">拖拽优化片段至下方:</p>
                      {[0, 1, 2].map(index => (
                        <DropZone
                          key={index}
                          index={index}
                          droppedText={droppedText}
                          setDroppedText={handleSetDroppedText}
                          handleClear={handleClear}
                          handleConfirm={handleConfirm}
                          showConfirmMsg={showConfirmMsg}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
                {/* Back to Essay and Accumulation Page Buttons */}
                <motion.div
                  className="mt-6 flex justify-center gap-4"
                  variants={FadeIn(0.6)}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <button
                    onClick={() => setActivePage('essay')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm flex items-center gap-2 hover:shadow-md transition-all duration-300"
                  >
                    <FaRobot className="text-xs" />
                    <span>作文优化</span>
                  </button>
                  <button
                    onClick={() => setActivePage('accumulation')}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full text-sm flex items-center gap-2 hover:shadow-md transition-all duration-300"
                  >
                    <FaListAlt className="text-xs" />
                    <span>积累模块</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="accumulation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-50 py-32 w-full relative overflow-hidden">
              <div className="absolute top-20 -right-40 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-40 left-20 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
  
              <div className="container mx-auto px-4">
                {/* Title Area */}
                <div className="flex flex-col justify-center items-center mb-10 text-center max-w-3xl mx-auto">
                  <motion.div
                    variants={FadeIn(0.1)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="inline-block px-4 py-1.5 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-full mb-6"
                  >
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600">积累模块 · 知识库</span>
                  </motion.div>
                  <motion.h2
                    variants={SlideUp(0.2)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600"
                  >
                    学习积累库
                  </motion.h2>
                  <motion.div
                    variants={SlideUp(0.3)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6"
                  >
                    <p>整理和复习学习过程中积累的单词、短语和佳句</p>
                  </motion.div>
                </div>
  
                {/* Main Content Area */}
                <motion.div
                  variants={FadeIn(0.5)}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-5xl mx-auto"
                >
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-white text-sm ml-2 font-mono">积累模块</div>
                  </div>
  
                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-100 max-w-5xl mx-auto">
                    <button
                      onClick={() => setActiveAccumulationTab('words')}
                      className={`flex-1 py-4 px-6 text-center font-medium rounded-t-md transition-all duration-200 ${
                        activeAccumulationTab === 'words'
                          ? 'bg-yellow-50 text-yellow-700 border-b-2 border-yellow-500'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      单词与短语
                    </button>
                    <button
                      onClick={() => setActiveAccumulationTab('sentences')}
                      className={`flex-1 py-4 px-6 text-center font-medium rounded-t-md transition-all duration-200 ${
                        activeAccumulationTab === 'sentences'
                          ? 'bg-yellow-50 text-yellow-700 border-b-2 border-yellow-500'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      佳句积累
                    </button>
                  </div>
  
                  {/* Tab Content */}
                  <div className="p-6 max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                      {activeAccumulationTab === 'words' ? (
                        <motion.div
                          key="words"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          {accumulatedWords.map((word, index) => (
                            <motion.div
                              key={word}
                              variants={ScaleUp(0.1 + index * 0.1)}
                              initial="initial"
                              whileInView="animate"
                              viewport={{ once: true }}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <span className="text-gray-800 font-medium">{word}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sentences"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-1 gap-4"
                        >
                          {accumulatedSentences.map((sentence, index) => (
                            <motion.div
                              key={sentence}
                              variants={ScaleUp(0.1 + index * 0.1)}
                              initial="initial"
                              whileInView="animate"
                              viewport={{ once: true }}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <span className="text-gray-800">{sentence}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
  
                {/* Navigation Buttons */}
                <motion.div
                  className="mt-6 flex justify-center gap-4"
                  variants={FadeIn(0.6)}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <button
                    onClick={() => setActivePage('essay')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm flex items-center gap-2 hover:shadow-md transition-all duration-300"
                  >
                    <FaRobot className="text-xs" />
                    <span>作文优化</span>
                  </button>
                  <button
                    onClick={() => setActivePage('reading')}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-sm flex items-center gap-2 hover:shadow-md transition-all duration-300"
                  >
                    <FaBook className="text-xs" />
                    <span>阅读功能</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DndProvider>
  );
};

export default AIFlow;

// --- Helper Animation Definitions (if not in separate file) ---
// Make sure these functions are defined or imported correctly.
// Example definitions:
/*
export const FadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

export const SlideUp = (delay = 0) => ({
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay } },
});

export const ScaleUp = (delay = 0) => ({
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.4, delay, type: 'spring', stiffness: 100 } },
});

export const BounceIn = (delay = 0) => ({
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.6, delay, type: 'spring', bounce: 0.4 } },
});
*/

// --- Add necessary CSS for animations if not using Tailwind plugins ---
/*
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
*/