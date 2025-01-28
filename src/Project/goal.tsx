import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { noterFirestore, firebaseTimestamp } from '../firebase/index';
import getCurrentUser from '../firebase/utils/getCurrentUser';

interface Topic {
  id: string;
  text: string;
  context: string;
  createdAt: any;
  userId: string;
}

const YoutubeSearch: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [context, setContext] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("pdf");
  const [loading, setLoading] = useState(true);

  const fileTypes = ["pdf", "ppt", "pptx", "doc", "docx", "txt", "py", "ts"];

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      const snapshot = await noterFirestore
        .collection('topics')
        .where('userId', '==', currentUser.uid)
        .get();
      
      const loadedTopics = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Topic[];

      setTopics(loadedTopics);
      
      // Load the most recent context if available
      if (loadedTopics.length > 0) {
        const mostRecentTopic = loadedTopics.sort((a, b) => b.createdAt - a.createdAt)[0];
        setContext(mostRecentTopic.context || '');
      }
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (inputText.trim() !== "" && context.trim() !== "") {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;

        const lines = inputText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "");

        const newTopics = await Promise.all(lines.map(async (line) => {
          const topicData = {
            text: `${line} ${context.trim()}`,
            context: context.trim(),
            createdAt: firebaseTimestamp(),
            userId: currentUser.uid
          };
          
          const docRef = await noterFirestore
            .collection('topics')
            .add(topicData);

          return {
            id: docRef.id,
            ...topicData
          };
        }));

        setTopics([...topics, ...newTopics]);
        setInputText("");
      } catch (error) {
        console.error('Error saving topics:', error);
      }
    }
  };

  const handleDelete = async (topicId: string) => {
    try {
      await noterFirestore
        .collection('topics')
        .doc(topicId)
        .delete();

      setTopics(topics.filter(topic => topic.id !== topicId));
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      const batch = noterFirestore.batch();
      topics.forEach(topic => {
        const docRef = noterFirestore.collection('topics').doc(topic.id);
        batch.delete(docRef);
      });

      await batch.commit();
      setTopics([]);
      setContext("");
    } catch (error) {
      console.error('Error deleting all topics:', error);
    }
  };

  const handleYoutubeSearch = (topic: string) => {
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`;
    window.open(youtubeSearchUrl, "_blank");
  };

  const handleGoogleSearch = (topic: string) => {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(topic)}+filetype:${selectedFileType}`;
    window.open(googleSearchUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6 bg-gray-100 rounded-2xl shadow-lg w-full max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800">YouTube Topic List</h1>
      <input
        type="text"
        placeholder="Enter context"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
      />
      <textarea
        placeholder="Enter topics (one per line)"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg resize-none h-40"
      />
      <button
        onClick={handleSave}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        Save Topics
      </button>
      <div className="w-full flex flex-col gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md"
          >
            <span className="text-gray-800 text-lg font-medium">{topic.text}</span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleYoutubeSearch(topic.text)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                YouTube
              </button>
              <div className="relative">
                <select
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value)}
                  className="px-2 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {fileTypes.map((fileType) => (
                    <option key={fileType} value={fileType}>
                      {fileType.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleGoogleSearch(topic.text)}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Search
              </button>
              <Trash2
                onClick={() => handleDelete(topic.id)}
                className="text-red-500 hover:text-red-600 cursor-pointer"
                size={20}
              />
            </div>
          </div>
        ))}
      </div>
      {topics.length > 0 && (
        <button
          onClick={handleDeleteAll}
          className="mt-4 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition"
        >
          Delete All
        </button>
      )}
    </div>
  );
};

export default YoutubeSearch;