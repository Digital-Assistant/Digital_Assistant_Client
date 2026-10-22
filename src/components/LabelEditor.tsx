import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button"; // Assuming we have a button component, or use standard HTML/Tailwind
// import { Input } from "@/components/ui/input"; // Assuming Input
import { Delete, PhoneMissed, Plus, Save, X } from "lucide-react"; // Icons
import { translate } from "../util/translation";

interface LabelEditorProps {
    initialLabels: Array<{ label: string; profanity: boolean }>;
    onSave: (labels: string[]) => void;
    onCancel: () => void;
}

export function LabelEditor({ initialLabels, onSave, onCancel }: LabelEditorProps) {
    const [labels, setLabels] = useState(initialLabels);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const handleLabelChange = (index: number, value: string) => {
        const newLabels = [...labels];
        newLabels[index] = { ...newLabels[index], label: value };
        setLabels(newLabels);
        if (errors[`label${index}`]) {
            const newErrors = { ...errors };
            delete newErrors[`label${index}`];
            setErrors(newErrors);
        }
    };

    const addLabel = () => {
        setLabels([...labels, { label: "", profanity: false }]);
    };

    const removeLabel = (index: number) => {
        const newLabels = [...labels];
        newLabels.splice(index, 1);
        setLabels(newLabels);
    };

    const handleSave = () => {
        // Basic validation if needed
        onSave(labels.map((l) => l.label));
    };

    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-col gap-2">
                {labels.map((item, index) => (
                    <div key={`label-${index}`} className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className={`flex-1 p-2 border rounded text-sm ${item.profanity ? "border-red-500 bg-red-50" : "border-gray-300"
                                    }`}
                                placeholder="Enter Label"
                                value={item.label}
                                onChange={(e) => handleLabelChange(index, e.target.value)}
                            />
                            {index > 0 && (
                                <button
                                    onClick={() => removeLabel(index)}
                                    className="p-1 text-gray-500 hover:text-red-500"
                                >
                                    <Delete size={16} />
                                </button>
                            )}
                        </div>
                        {item.profanity && (
                            <span className="text-xs text-red-500 mt-1">
                                {translate("profanityDetected")}
                            </span>
                        )}
                        {errors[`label${index}`] && (
                            <span className="text-xs text-red-500 mt-1">
                                {translate("inputError")}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-2">
                <button
                    onClick={addLabel}
                    className="flex items-center gap-1 text-xs text-primary text-blue-600 hover:text-blue-800"
                >
                    <Plus size={14} /> {translate("addLabel")}
                </button>
            </div>

            <div className="flex justify-end gap-2 mt-2">
                <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-1 hover:bg-blue-700"
                >
                    <Save size={14} /> Save
                </button>
                <button
                    onClick={onCancel}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm flex items-center gap-1 hover:bg-gray-300"
                >
                    <X size={14} /> Cancel
                </button>
            </div>
        </div>
    );
}
