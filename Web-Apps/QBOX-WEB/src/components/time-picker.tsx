import React, { useState, useEffect } from "react";

interface TimePickerProps {
    value?: {
        fromTime: string;
        toTime: string;
    };
    onChange?: (timeRange: { fromTime: string; toTime: string }) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    const [fromTime, setFromTime] = useState({ hour: "", minute: "", period: "AM" });
    const [toTime, setToTime] = useState({ hour: "", minute: "", period: "AM" });

    // Parse incoming value prop when it changes
    useEffect(() => {
        if (value) {
            // Parse the fromTime
            if (value.fromTime) {
                const [fromHourMinute, fromPeriod] = value.fromTime.split(" ");
                const [fromHour, fromMinute] = fromHourMinute.split(":");
                setFromTime({
                    hour: fromHour,
                    minute: fromMinute,
                    period: fromPeriod
                });
            }

            // Parse the toTime
            if (value.toTime) {
                const [toHourMinute, toPeriod] = value.toTime.split(" ");
                const [toHour, toMinute] = toHourMinute.split(":");
                setToTime({
                    hour: toHour,
                    minute: toMinute,
                    period: toPeriod
                });
            }
        }
    }, [value]);

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")); // 01 to 12
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
    const periods = ["AM", "PM"];

    const handleTimeChange = (type: "from" | "to", field: string, value: string) => {
        if (type === "from") {
            const newFromTime = { ...fromTime, [field]: value };
            setFromTime(newFromTime);

            // Only emit change if we have complete time data
            if (newFromTime.hour && newFromTime.minute) {
                emitChange(newFromTime, toTime);
            }
        } else {
            const newToTime = { ...toTime, [field]: value };
            setToTime(newToTime);

            // Only emit change if we have complete time data
            if (newToTime.hour && newToTime.minute) {
                emitChange(fromTime, newToTime);
            }
        }
    };

    const emitChange = (from: typeof fromTime, to: typeof toTime) => {
        if (onChange) {
            const formattedFromTime = formatTime(from);
            const formattedToTime = formatTime(to);

            // Only emit if both times are properly formatted
            if (formattedFromTime && formattedToTime) {
                onChange({
                    fromTime: formattedFromTime,
                    toTime: formattedToTime
                });
            }
        }
    };

    const formatTime = (time: { hour: string; minute: string; period: string }) => {
        return time.hour && time.minute
            ? `${time.hour}:${time.minute} ${time.period}`
            : "";
    };

    return (
        <div>
            <label className="block text-sm mb-1">
                Shift Time <span className="text-color">*</span>
            </label>
            <div className="flex justify-between">
                <div style={{ marginBottom: 20, marginRight: 10 }}>
                    <label className="block text-sm mb-1">Start Time:</label>

                    <div style={{ display: "flex", gap: 10 }}>
                        <select
                            value={fromTime.hour}
                            onChange={(e) => handleTimeChange("from", "hour", e.target.value)}>
                            <option value="">HH</option>
                            {hours.map((h) => (
                                <option key={h} value={h}>
                                    {h}
                                </option>
                            ))}
                        </select>
                        <select
                            value={fromTime.minute}
                            onChange={(e) => handleTimeChange("from", "minute", e.target.value)}
                        >
                            <option value="">MM</option>
                            {minutes.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>

                        <select
                            value={fromTime.period}
                            onChange={(e) => handleTimeChange("from", "period", e.target.value)}
                        >
                            {periods.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* To Time */}
                <div style={{ marginBottom: 20 }}>
                    <label className="block text-sm mb-1">End Time:</label>
                    <div style={{ display: "flex", gap: 10 }}>
                        <select
                            value={toTime.hour}
                            onChange={(e) => handleTimeChange("to", "hour", e.target.value)}
                        >
                            <option value="">HH</option>
                            {hours.map((h) => (
                                <option key={h} value={h}>
                                    {h}
                                </option>
                            ))}
                        </select>

                        <select
                            value={toTime.minute}
                            onChange={(e) => handleTimeChange("to", "minute", e.target.value)}
                        >
                            <option value="">MM</option>
                            {minutes.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>

                        <select
                            value={toTime.period}
                            onChange={(e) => handleTimeChange("to", "period", e.target.value)}
                        >
                            {periods.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Display selected time */}
            <div>
                <strong>Selected Time:</strong> {formatTime(fromTime)} - {formatTime(toTime)}
            </div>
        </div>
    );
};

export default TimePicker;