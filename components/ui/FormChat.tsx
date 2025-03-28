'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Bot, User, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/ui/Header';

const questions = [
    {
        id: 'name',
        text: "Hi there 👋 I'm Meela, your friendly Math AI tutor. I'm here to help make learning math easier, fun, and bite-sized — just like tacos 🌮 Can you tell me your name?",
        type: 'text',
    },
    {
        id: 'email',
        text: 'Thanks, {{name}} nice to meet you! Before we begin, can you please enter your email so I can save your learning progress?',
        type: 'email',
    },
    {
        id: 'password',
        text: 'Great! Now please create a password for your account.',
        type: 'password',
    },
    {
        id: 'referral',
        text: 'How did you hear about StudyTaco?',
        type: 'select',
        options: ['Instagram', 'Twitter/X', 'Friends/Family', 'Other'],
    },
    {
        id: 'next',
        text: 'All done, thanks {{name}}! 🙌 You can now: Start a quick Assessment to build your personalized plan Explore the Homework Helper Or Choose a Topic to start learning right away Would you like me to walk you through these features?',
        type: 'textarea',
    },
];

// Add the interpolation helper function
const interpolateText = (
    text: string,
    answers: Record<string, string>
): string => {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        if (key === 'appName') return 'StudyTaco';
        return answers[key] || '';
    });
};

export default function FormChat() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<
        Array<{ type: string; content: string; id?: string }>
    >([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;

    // Function to simulate typing effect
    const addBotMessage = (message: string, questionId?: string) => {
        setIsTyping(true);

        // Interpolate variables using existing answers
        const interpolatedMessage = interpolateText(message, answers);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { type: 'bot', content: interpolatedMessage, id: questionId }, // Use interpolatedMessage here instead of message
            ]);
            setIsTyping(false);
        }, 800);
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Handle form submission
    const handleSubmit = () => {
        if (
            !inputValue.trim() &&
            questions[currentQuestionIndex].type !== 'select'
        )
            return;

        const currentQuestion = questions[currentQuestionIndex];
        const answer = inputValue || answers[currentQuestion.id] || '';

        // Add user message
        setMessages((prev) => [...prev, { type: 'user', content: answer }]);

        // Save answer
        setAnswers((prev) => {
            const newAnswers = { ...prev, [currentQuestion.id]: answer };
            return newAnswers;
        });

        // If there's a next question, send its message with updated answers
        if (currentQuestionIndex < questions.length - 1) {
            const nextQuestion = questions[currentQuestionIndex + 1];
            setTimeout(() => {
                const interpolatedMessage = interpolateText(nextQuestion.text, {
                    ...answers,
                    [currentQuestion.id]: answer,
                });
                setMessages((prev) => [
                    ...prev,
                    {
                        type: 'bot',
                        content: interpolatedMessage,
                        id: nextQuestion.id,
                    },
                ]);
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }, 800);
        } else {
            // Form is complete
            setIsComplete(true);
            addBotMessage(
                "Perfect! Your account is all set up. Let's get you started with StudyTaco!"
            );
        }

        // Clear input
        setInputValue('');
    };

    // Handle select change
    const handleSelectChange = (value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questions[currentQuestionIndex].id]: value,
        }));
        setInputValue(value);
    };

    // Start the onboarding process
    const startOnboarding = () => {
        setShowWelcome(false);
        setTimeout(() => {
            addBotMessage(questions[0].text, questions[0].id);
        }, 300);
    };

    // Handle form completion
    const completeOnboarding = () => {
        // In a real app, you would save the user data and redirect to the dashboard
        console.log('Onboarding complete with data:', answers);
        // For demo purposes, we'll just reset the form
        setCurrentQuestionIndex(0);
        setAnswers({});
        setInputValue('');
        setMessages([]);
        setIsComplete(false);
        setShowWelcome(true);
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col'>
            <Header
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                showWelcome={showWelcome}
                isComplete={isComplete}
            />

            {/* App Header */}
            <AnimatePresence mode='wait'>
                {showWelcome ? (
                    <motion.div
                        key='welcome'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className='flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full'
                    >
                        <div className='text-center space-y-6 max-w-2xl'>
                            <div className='bg-primary text-primary-foreground rounded-full p-4 inline-block mx-auto'>
                                <Sparkles className='h-12 w-12' />
                            </div>
                            <h1 className='text-4xl font-bold tracking-tight'>
                                Welcome to StudyTaco
                            </h1>
                            <p className='text-xl text-muted-foreground'>
                                Let&apos;s get you set up in just a few quick
                                steps. Our assistant Meela will guide you
                                through the process.
                            </p>
                            <Button
                                size='lg'
                                onClick={startOnboarding}
                                className='mt-8 text-lg px-8 py-6 h-auto gap-2'
                            >
                                Get Started <ArrowRight className='h-5 w-5' />
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='chat'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='flex-1 flex flex-col max-w-4xl mx-auto w-full'
                    >
                        {/* Progress Bar */}
                        {!isComplete && (
                            <div className='w-full h-1 bg-muted'>
                                <motion.div
                                    className='h-full bg-primary'
                                    initial={{
                                        width: `${
                                            (currentQuestionIndex /
                                                questions.length) *
                                            100
                                        }%`,
                                    }}
                                    animate={{
                                        width: `${progressPercentage}%`,
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        )}

                        {/* Chat Container */}
                        <div className='flex-1 overflow-y-auto p-6'>
                            <div className='space-y-6'>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={cn(
                                            'flex',
                                            message.type === 'user'
                                                ? 'justify-end'
                                                : 'justify-start'
                                        )}
                                    >
                                        <div className='flex items-start gap-3 max-w-[80%]'>
                                            {message.type === 'bot' && (
                                                <div className='bg-primary text-primary-foreground rounded-full p-2 mt-1'>
                                                    <Bot size={20} />
                                                </div>
                                            )}

                                            <div
                                                className={cn(
                                                    'p-4 rounded-2xl shadow-sm',
                                                    message.type === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                        : 'bg-card rounded-tl-none border'
                                                )}
                                            >
                                                {message.content}
                                            </div>

                                            {message.type === 'user' && (
                                                <div className='bg-primary text-primary-foreground rounded-full p-2 mt-1'>
                                                    <User size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className='flex justify-start'
                                    >
                                        <div className='flex items-start gap-3 max-w-[80%]'>
                                            <div className='bg-primary text-primary-foreground rounded-full p-2 mt-1'>
                                                <Bot size={20} />
                                            </div>
                                            <div className='p-4 rounded-2xl shadow-sm bg-card rounded-tl-none border'>
                                                <div className='flex space-x-2'>
                                                    <div
                                                        className='h-2 w-2 bg-primary rounded-full animate-bounce'
                                                        style={{
                                                            animationDelay:
                                                                '0ms',
                                                        }}
                                                    ></div>
                                                    <div
                                                        className='h-2 w-2 bg-primary rounded-full animate-bounce'
                                                        style={{
                                                            animationDelay:
                                                                '150ms',
                                                        }}
                                                    ></div>
                                                    <div
                                                        className='h-2 w-2 bg-primary rounded-full animate-bounce'
                                                        style={{
                                                            animationDelay:
                                                                '300ms',
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className='p-6 border-t bg-background'>
                            {!isComplete ? (
                                <div className='flex flex-col gap-3'>
                                    {currentQuestionIndex <
                                        questions.length && (
                                        <>
                                            {questions[currentQuestionIndex]
                                                .type === 'select' ? (
                                                <Select
                                                    onValueChange={
                                                        handleSelectChange
                                                    }
                                                >
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select an option' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {questions[
                                                            currentQuestionIndex
                                                        ].options?.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            ) : questions[currentQuestionIndex]
                                                  .type === 'textarea' ? (
                                                <Textarea
                                                    placeholder='Type your response...'
                                                    value={inputValue}
                                                    onChange={(e) =>
                                                        setInputValue(
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className='resize-none'
                                                />
                                            ) : (
                                                <Input
                                                    type={
                                                        questions[
                                                            currentQuestionIndex
                                                        ].type
                                                    }
                                                    placeholder='Type your answer...'
                                                    value={inputValue}
                                                    onChange={(e) =>
                                                        setInputValue(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        e.key === 'Enter' &&
                                                        handleSubmit()
                                                    }
                                                    className='text-base py-6'
                                                />
                                            )}

                                            <Button
                                                onClick={handleSubmit}
                                                className='w-full py-6 text-base flex items-center gap-2'
                                                size='lg'
                                                disabled={
                                                    isTyping ||
                                                    (!inputValue &&
                                                        questions[
                                                            currentQuestionIndex
                                                        ].type !== 'select')
                                                }
                                            >
                                                Continue{' '}
                                                <ArrowRight size={18} />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className='space-y-4 text-center'>
                                    <h2 className='text-2xl font-bold'>
                                        You&apos;re all set!
                                    </h2>
                                    <p className='text-muted-foreground'>
                                        Thank you for completing your profile.
                                        We&apos;re excited to have you on board!
                                    </p>
                                    <Button
                                        onClick={completeOnboarding}
                                        className='w-full py-6 text-base'
                                        size='lg'
                                    >
                                        Go to Dashboard
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
