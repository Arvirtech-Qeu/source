import { useState } from 'react';

export const TagInput = ({ tags, onChange }) => {
    const [newTag, setNewTag] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && newTag.trim() !== '') {
            onChange([...tags, newTag]);
            setNewTag('');
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 text-sm font-medium bg-gray-200 rounded-full">{tag}</span>
            ))}
            <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-b border-gray-300 outline-none"
                placeholder="Type and press Enter"
            />
        </div>
    );
};

// Usage
{/* <TagInput tags={['React', 'JavaScript']} onChange={(newTags) => console.log(newTags)} /> */ }
