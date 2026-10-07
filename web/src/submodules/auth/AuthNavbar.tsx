import { colors } from '../../styles/colors';

interface AuthNavbarProps {
    onNavigateHome?: () => void;
    rightActionText: string;
    rightActionPrompt: string;
    onRightActionClick?: () => void;
}

export function AuthNavbar({
    onNavigateHome,
    rightActionText,
    rightActionPrompt,
    onRightActionClick,
}: AuthNavbarProps) {
    return (
        <header
            className="sticky top-0 left-0 right-0 z-[9999] border-b backdrop-blur-2xl shadow-sm shrink-0 w-full"
            style={{ backgroundColor: `${colors.light.background}f2`, borderColor: colors.light.border }}
        >
            {/* w-full sem max-w restrito garante que os elementos vão totalmente para os cantos */}
            <div className="flex h-[78px] w-full items-center justify-between px-6 lg:px-12">
                <button
                    type="button"
                    onClick={onNavigateHome}
                    className="flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.05em] cursor-pointer group border-0 bg-transparent p-0"
                    style={{ color: colors.light['text-main'] }}
                >
                    <div
                        className="relative flex size-10 items-center justify-center rounded-[11px] border-2 p-1 shadow-[3px_3px_0_#171513] group-hover:scale-105 transition-transform overflow-hidden"
                        style={{ backgroundColor: colors.light.background, borderColor: colors.light['text-main'] }}
                    >
                        <img src="/mascot.png" alt="SpellBinder Logo" className="w-full h-full object-contain" />
                    </div>
                    <span>SpellBinder</span>
                </button>

                <p className="text-sm m-0" style={{ color: colors.light['text-muted'] }}>
                    {rightActionPrompt}{' '}
                    <button
                        type="button"
                        onClick={onRightActionClick}
                        className="font-bold hover:underline cursor-pointer ml-1 bg-transparent border-0 p-0"
                        style={{ color: colors.light.bronze }}
                    >
                        {rightActionText}
                    </button>
                </p>
            </div>
        </header>
    );
}

export default AuthNavbar;