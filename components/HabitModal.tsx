import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useHaptics } from '../hooks/useHaptics';

interface HabitModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (title: string, emoji: string) => void;
  onDelete?: () => void;
  initialTitle?: string;
  initialEmoji?: string;
  isEditing?: boolean;
}

const { height } = Dimensions.get('window');

const COMMON_EMOJIS = [
  '💧', '🏃‍♂️', '📚', '🧘‍♀️', '🥗', '💤', '✍️', '🎵',
  '🏋️‍♂️', '🚰', '🍎', '🌱', '☀️', '🎯', '📱', '🧠',
  '💊', '🥛', '🚶‍♂️', '🎨', '📖', '🧽', '🌿', '⭐',
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isVisible,
  onClose,
  onSave,
  onDelete,
  initialTitle = '',
  initialEmoji = '✨',
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [selectedEmoji, setSelectedEmoji] = useState(initialEmoji);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  const { success, light, selection, error } = useHaptics();
  const titleInputRef = useRef<TextInput>(null);
  const scale = useSharedValue(1);

  useEffect(() => {
    setTitle(initialTitle);
    setSelectedEmoji(initialEmoji);
  }, [initialTitle, initialEmoji, isVisible]);

  useEffect(() => {
    if (isVisible) {
      // Focus input after modal animation completes
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 300);
    }
  }, [isVisible]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      runOnJS(error)();
      Alert.alert('Missing Title', 'Please enter a title for your habit.');
      return;
    }

    runOnJS(success)();
    onSave(trimmedTitle, selectedEmoji);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This will remove all your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            runOnJS(error)();
            onDelete?.();
            onClose();
          },
        },
      ]
    );
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    runOnJS(selection)();
    
    // Gentle animation feedback
    scale.value = withSpring(1.05, { damping: 15, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, 100);
  };

  const animatedEmojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <BlurView intensity={95} style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {isEditing ? 'Edit Habit' : 'New Habit'}
            </Text>
            <TouchableOpacity 
              onPress={handleSave} 
              style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
            >
              <Text style={[styles.saveText, !title.trim() && styles.saveTextDisabled]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Selected Emoji Display */}
            <View style={styles.selectedEmojiContainer}>
              <Animated.Text style={[styles.selectedEmoji, animatedEmojiStyle]}>
                {selectedEmoji}
              </Animated.Text>
            </View>

            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Habit Title</Text>
              <TextInput
                ref={titleInputRef}
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter your habit (e.g., Drink Water)"
                placeholderTextColor="#8E8E93"
                maxLength={50}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            </View>

            {/* Emoji Picker */}
            <View style={styles.emojiPickerContainer}>
              <Text style={styles.inputLabel}>Choose an Emoji</Text>
              <View style={styles.emojiGrid}>
                {COMMON_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.emojiButton,
                      selectedEmoji === emoji && styles.emojiButtonSelected,
                    ]}
                    onPress={() => handleEmojiSelect(emoji)}
                  >
                    <Text style={styles.emojiButtonText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Delete Button (only when editing) */}
            {isEditing && onDelete && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete Habit</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    maxHeight: height * 0.9,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(142, 142, 147, 0.3)',
  },
  cancelButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 17,
    color: '#007AFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  saveTextDisabled: {
    color: '#8E8E93',
  },
  scrollView: {
    flex: 1,
  },
  selectedEmojiContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  selectedEmoji: {
    fontSize: 80,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  textInput: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 17,
    color: '#1C1C1E',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  emojiPickerContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emojiButton: {
    width: '12%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  emojiButtonSelected: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.1 }],
  },
  emojiButtonText: {
    fontSize: 24,
  },
  deleteButton: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
}); 