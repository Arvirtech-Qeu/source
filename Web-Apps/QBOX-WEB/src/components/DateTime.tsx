import { CalendarDays, Clock } from 'lucide-react';

const DateTime = ({ date, color = 'black', showTime = true, showDate = true, showDateIcon = true, showTimeIcon = true }) => {
    const formatDate = (date) => {
        return date ? new Date(date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }) : '';
    };

    const formatTime = (date) => {
        return date ? new Date(date).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(',', '') : '';
    };

    return (
        <div className="flex items-center" style={{ color: color }}>
            {showDate && (
                <div className="flex items-center">
                    {showDateIcon && <CalendarDays className="" style={{ width: '25px', height: '20px' }} />}
                    <span>{formatDate(date)}</span>
                </div>
            )}

            {showTime && (
                <div className="flex items-center ml-2">
                    {showTimeIcon && <Clock className="" style={{ width: '20px', height: '20px' }} />}
                    <span>{formatTime(date)}</span>
                </div>
            )}
        </div>
    );
};

export default DateTime;