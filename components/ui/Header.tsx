import { Sparkles } from 'lucide-react';

interface HeaderProps {
    currentQuestionIndex?: number;
    totalQuestions?: number;
    showWelcome?: boolean;
    isComplete?: boolean;
}

export function Header({
    currentQuestionIndex = 0,
    totalQuestions = 0,
    showWelcome = true,
    isComplete = false,
}: HeaderProps) {
    return (
        <header className='w-full bg-background border-b py-4 px-6 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <Sparkles className='h-6 w-6 text-primary' />
                <h1 className='text-xl font-bold'>StudyTaco</h1>
            </div>
            <div className='text-sm text-muted-foreground'>
                {!showWelcome && !isComplete && (
                    <span>
                        Step {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                )}
            </div>
        </header>
    );
}
