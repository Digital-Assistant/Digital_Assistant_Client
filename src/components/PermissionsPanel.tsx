import { translate } from "../util/translation";

interface PermissionsPanelProps {
    config: any;
    permissionsObj: any;
    onPermissionChange: (key: string, value: any) => void;
    onTimeChange: (value: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export function PermissionsPanel({
    config,
    permissionsObj,
    onPermissionChange,
    onTimeChange,
    isOpen,
    onToggle,
}: PermissionsPanelProps) {
    if (!config?.enablePermissions) return null;

    return (
        <div id="uda-permissions-section" className="p-6 flex flex-col gap-4">
            <div>
                <button
                    className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
                    onClick={onToggle}
                >
                    {isOpen ? "Update Permissions" : "Edit Permissions"}
                </button>
            </div>

            {isOpen && (
                <div className="flex flex-col gap-2 ml-8">
                    {config?.permissions &&
                        Object.entries(config.permissions).map(([key, value]) => {
                            const checked = !!(permissionsObj && permissionsObj[key]);

                            return (
                                <div key={key} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`uda-permission-${key}`}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        checked={checked}
                                        onChange={() => onPermissionChange(key, value)}
                                    />
                                    <label
                                        htmlFor={`uda-permission-${key}`}
                                        className="text-sm font-medium text-gray-900"
                                    >
                                        {key} {String(value)}
                                    </label>
                                </div>
                            );
                        })}

                    {/* Global Slow Playback Time Input */}
                    <div className="mt-2 flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-900">
                            {translate("slowPlaybackTime") || "Slow Playback Time"}:
                        </label>
                        <input
                            type="number"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 p-2.5"
                            value={permissionsObj.slowPlaybackTime || ""}
                            onChange={(e) => onTimeChange(e.target.value)}
                            placeholder="ms"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
