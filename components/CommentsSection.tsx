import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getCommentsForVideo, addComment, deleteComment } from '@/lib/appwrite';

const CommentsSection = ({ videoId }: { videoId: string }) => {
  const { user } = useGlobalContext();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getCommentsForVideo(videoId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', error.message || 'Error fetching comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handlePostComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Empty Comment', 'Please enter a comment.');
      return;
    }
    if (!user) {
      Alert.alert('Not Logged In', 'You must be logged in to comment.');
      return;
    }
    try {
      const newComment = await addComment(videoId, user.$id, user.username, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', error.message || 'Error posting comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete your comment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComment(commentId);
              setComments(prev => prev.filter(comment => comment.$id !== commentId));
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', error.message || 'Error deleting comment');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderCommentItem = ({ item }: { item: any }) => (
    <View className="py-3 border-b border-secondary flex-row items-center w-full">
      <View className="flex-1">
        <Text className="text-base font-semibold text-white">
          {item.username || 'Anonymous'}:
        </Text>
        <Text className="text-sm text-gray-300 mt-1">{item.comment}</Text>
      </View>
      {/* Show delete button if the comment belongs to the current user */}
      {user && item.userId === user.$id && (
        <TouchableOpacity onPress={() => handleDeleteComment(item.$id)} className="ml-2">
          <Text className="text-red-500 font-bold text-xl">×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-primary w-full">
      <FlatList
        data={comments}
        keyExtractor={(item) => item.$id}
        renderItem={renderCommentItem}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 my-4">No comments yet.</Text>
        }
        refreshing={loading}
        onRefresh={fetchComments}
        className="w-full"
      />
      <View className="flex-row items-center p-4 border-t border-secondary w-full">
        <TextInput
          className="flex-1 border border-secondary rounded-lg p-2 text-white"
          placeholder="Write a comment..."
          placeholderTextColor="gray"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity onPress={handlePostComment} className="ml-4 bg-secondary p-2 rounded-lg">
          <Text className="text-white font-semibold">Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentsSection;
