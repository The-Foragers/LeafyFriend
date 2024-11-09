import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity } from 'react-native';
import { askBotanist } from '@/scripts/QwenChatBot'; 
import styles from '@/app/res/styles/chatbotStyles'; 
import TypingIndicator from '../res/styles/TypingIndicator';
import Markdown from 'react-native-markdown-display';

const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{sender: string, text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = React.useRef<FlatList | null>(null);

  const handleAskQuestion = async () => {
    const newMessages = [...messages, { sender: 'user', text: question }]
    setMessages(newMessages);
    setQuestion('');
    setIsTyping(true);

    const formattedMessages = newMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    const response = await askBotanist(formattedMessages);
    setIsTyping(false);
    setMessages([...newMessages, { sender: 'bot', text: response }]); // Add bot response
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style = {item.sender === 'user' ? styles.userMessage : styles.botMessage}>
            <Markdown style={{ body: styles.messageText }}>{item.text}</Markdown>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style = {styles.messageList}
        contentContainerStyle={{paddingBottom: 20}}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {isTyping && <TypingIndicator />}
      <View style={styles.inputContainer}>
        <TextInput
          style = {styles.input}
          placeholder="Enter your question here"
          value={question}
          onChangeText={setQuestion}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAskQuestion}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chatbot;