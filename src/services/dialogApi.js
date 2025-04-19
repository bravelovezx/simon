/**
 * 对话API服务
 * 提供与AI对话相关的API函数
 */

// 基础API URL
const API_BASE_URL = 'http://localhost:8000';

/**
 * 获取AI对话记录
 * 从服务器获取AI发送的对话消息列表
 * 
 * @returns {Promise<Array>} AI对话消息数组
 */
export const fetchAIDialogs = async () => {
  try {
    // 实际项目中应该从API获取数据
    // 这里模拟API调用，返回模拟数据
    // const response = await fetch(`${API_BASE_URL}/api/dialogs/ai`);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return await response.json();

    // 模拟数据
    return Promise.resolve([
      {
        id: 1,
        sender: "ai",
        name: "Catherine",
        text: "Hey, glad you're here. I'm ready to talk with you. What do you want to talk with me this time?",
        avatar: "/src/assets/catherine.svg",
      },
      {
        id: 2,
        sender: "ai",
        name: "Catherine",
        text: "Oh, I love Harry Potter! Did you read all the books and watch all the movies?",
        avatar: "/src/assets/catherine.svg",
      },
      {
        id: 3,
        sender: "ai",
        name: "Catherine",
        text: "That's okay! The books are really cool, but the movies are amazing too. Which movie was your favorite?",
        avatar: "/src/assets/catherine.svg",
      },
    ]);
  } catch (error) {
    console.error('Error fetching AI dialogs:', error);
    throw error;
  }
};

/**
 * 获取用户对话记录
 * 从服务器获取用户发送的对话消息列表
 * 
 * @returns {Promise<Array>} 用户对话消息数组
 */
export const fetchUserDialogs = async () => {
  try {
    // 实际项目中应该从API获取数据
    // 这里模拟API调用，返回模拟数据
    // const response = await fetch(`${API_BASE_URL}/api/dialogs/user`);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return await response.json();

    // 模拟数据
    return Promise.resolve([
      {
        id: 1,
        sender: "user",
        name: "Me",
        text: "I want to talk to you about Harry Potter",
        avatar: "/src/assets/user.svg",
        grammar: "I want to talk to you about Harry Potter.",
        grammarNote: "这句话的正确说法应该是：I want to talk to you about Harry Potter.",
        aiPolish: "暂无AI润色数据"
      },
      {
        id: 2,
        sender: "user",
        name: "Me",
        text: "I have seen the movie but not the book.",
        avatar: "/src/assets/user.svg",
        grammar: "I have seen the movies but not read the books.",
        grammarNote: "这句话的正确说法应该是：I have seen the movies but not read the books.",
        aiPolish: "暂无AI润色数据"
      },
    ]);
  } catch (error) {
    console.error('Error fetching user dialogs:', error);
    throw error;
  }
};

/**
 * 获取语法纠错数据
 * 从服务器获取特定对话的语法纠错信息
 * 
 * @param {number} dialogId - 对话ID
 * @returns {Promise<Object>} 语法纠错数据
 */
export const fetchGrammarCorrections = async (dialogId) => {
  try {
    // 实际项目中应该从API获取数据
    // 这里模拟API调用，返回模拟数据
    // const response = await fetch(`${API_BASE_URL}/api/grammar/${dialogId}`);
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return await response.json();

    // 模拟数据 - 根据dialogId返回不同的语法纠错数据
    const mockData = {
      1: {
        grammar: "I want to talk to you about Harry Potter.",
        grammarNote: "这句话的正确说法应该是：I want to talk to you about Harry Potter.",
        aiPolish: "I would like to discuss Harry Potter with you."
      },
      2: {
        grammar: "I have seen the movies but not read the books.",
        grammarNote: "这句话的正确说法应该是：I have seen the movies but not read the books.",
        aiPolish: "I've watched the Harry Potter films but haven't read any of the books yet."
      },
      3: {
        grammar: "",
        grammarNote: "暂无语法错误",
        aiPolish: ""
      }
    };

    return Promise.resolve(mockData[dialogId] || {
      grammar: "",
      grammarNote: "未找到该对话的语法纠错数据",
      aiPolish: ""
    });
  } catch (error) {
    console.error('Error fetching grammar corrections:', error);
    throw error;
  }
};

/**
 * 发送用户回复
 * 向服务器发送用户的回复消息，并获取AI的响应
 * 
 * @param {string} message - 用户回复消息
 * @returns {Promise<Object>} 包含AI回复和语法纠错的响应对象
 */
export const sendUserReply = async (message) => {
  try {
    // 实际项目中应该向API发送数据
    // 这里模拟API调用，返回模拟数据
    // const response = await fetch(`${API_BASE_URL}/api/reply`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ message }),
    // });
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // return await response.json();

    // 模拟数据 - 简单的AI回复和语法纠错
    return Promise.resolve({
      aiReply: "That's interesting! Can you tell me more about your thoughts on that?",
      grammar: message + (message.endsWith('.') ? '' : '.'),
      grammarNote: message.endsWith('.') ? "语法正确" : "句子应该以句号结尾。",
      aiPolish: `I think ${message.toLowerCase()}`.replace(/\.$/, '') + "."
    });
  } catch (error) {
    console.error('Error sending user reply:', error);
    throw error;
  }
};