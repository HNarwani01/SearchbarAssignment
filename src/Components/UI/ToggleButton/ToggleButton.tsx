// components/ToggleButton.tsx

'use client'
import './styles.css';

interface ToggleButtonProps {
    currentState: boolean; // Renamed for clarity, it's not optional anymore
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ currentState }) => {
    // NO MORE local useState! The component is now "dumb".
    // Its appearance is 100% controlled by the parent.

    return (
        <div
            // The button's visual state is now directly tied to the prop
            className={`cursor-pointer w-[32px] h-[20px] flex items-center p-[2px] rounded-full ${currentState ? 'activeButton' : 'inactiveButton'}`}
        >
            <div className='w-[16px] h-[16px] rounded-full bg-[#FFF]'></div>
        </div>
    );
}

export default ToggleButton;
