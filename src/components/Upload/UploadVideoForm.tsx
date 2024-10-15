import React, { useState } from 'react';

interface VideoData {
    videoKey: string;
    videoUrl: string;
    videoPreviewUrl: string;
    thumbnailUrl: string;
    duration: number;
    tags: string[];
    serie: string | undefined;
    lastModified: string;
    description: string | undefined;
}

const VideoForm = ({ videoData }: { videoData: VideoData }) => {
    const [tags, setTags] = useState<string[]>(videoData?.tags || []);
    const [serie, setSerie] = useState<string | undefined>(videoData?.serie || undefined);
    const [description, setDescription] = useState<string | undefined>(videoData?.description || undefined);

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTags = [...tags];
        newTags[index] = e.target.value;
        setTags(newTags);
    };

    const handleAddTag = () => {
        setTags([...tags, '']);
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags?.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = {
            videoKey: videoData?.videoKey,
            videoUrl: videoData?.videoUrl,
            videoPreviewUrl: videoData?.videoPreviewUrl,
            thumbnailUrl: videoData?.thumbnailUrl,
            duration: videoData?.duration,
            tags,
            serie,
            lastModified: videoData?.lastModified,
            description,
        };
        console.log("Form Data:", formData);
        // Handle form submission logic here (e.g., send data to API)
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 rounded-lg mx-auto relative w-full">
            <h2 className="text-xl font-semibold mb-2">Video Information</h2>

            <div className="form-control mb-2">
                <label className="label">
                    <span className="label-text">Video Key</span>
                </label>
                <input
                    type="text"
                    value={videoData?.videoKey || "vidKey" }
                    className="input input-bordered w-full"
                    disabled
                />
            </div>

            <div className="form-control mb-2">
                <label className="label">
                    <span className="label-text">Video URL</span>
                </label>
                <input
                    type="text"
                    value={videoData?.videoUrl || " vidUrl"}
                    className="input input-bordered w-full"
                    disabled
                />
            </div>

            <div className="form-control mb-2">
                <label className="label">
                    <span className="label-text">Preview URL</span>
                </label>
                <input
                    type="text"
                    value={videoData?.videoPreviewUrl || "vidPreview"}
                    className="input input-bordered w-full"
                    disabled
                />
            </div>

            <div className="form-control mb-2">
                <label className="label">
                    <span className="label-text">Thumbnail URL</span>
                </label>
                <input
                    type="text"
                    value={videoData?.thumbnailUrl || "thumbUrl"}
                    className="input input-bordered w-full"
                    disabled
                />
            </div>

            <div className="form-control mb-2">
                <label className="label">
                    <span className="label-text">Duration</span>
                </label>
                <input
                    type="text"
                    value={videoData?.duration || "duration"}
                    className="input input-bordered w-full"
                    disabled
                />
            </div>

            <div className="form-control mb-2">
                <label className="label">
                    <span className="label-text">Last Modified</span>
                </label>
                <input
                    type="text"
                    value={videoData?.lastModified}
                    className="input input-bordered w-full"
                    disabled
                />
            </div>

            {/* Editable Fields */}
            <div className="form-control mb-2">
                <label className="label">
                    <span className="label-text">Description</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea textarea-bordered w-full"
                ></textarea>
            </div>

            <div className="form-control mb-2">
                <label className="label">
                    <span className="label-text">Series Title</span>
                </label>
                <input
                    type="text"
                    value={serie || ''}
                    onChange={(e) => setSerie(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>

            <div className="form-control ">{/* mb-4 */}
                <label className="label">
                    <span className="label-text">Tags</span>
                </label>
                {tags.map((tag, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleTagChange(e, index)}
                            className="input input-bordered w-full"
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-error ml-2"
                            onClick={() => handleRemoveTag(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" className="btn btn-sm btn-secondary mt-2" onClick={handleAddTag}>
                    Add Tag
                </button>
            </div>
            <div className="divider">{/* OR */}</div>
            <div className="form-control">
                <button type="submit" className="btn btn-primary w-full">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default VideoForm;
