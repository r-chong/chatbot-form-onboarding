import Link from 'next/link';

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
                <div className='flex flex-row gap-2'>
                    <Link href='/' className='select-none cursor-pointer'>
                        <div className='flex flex-row gap-2'>
                            <p className='text-xl select-none'>🌮</p>
                            <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 select-none'>
                                StudyTaco
                            </h1>
                        </div>
                    </Link>
                </div>
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
