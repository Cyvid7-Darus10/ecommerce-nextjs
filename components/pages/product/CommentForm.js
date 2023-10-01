import { useState } from "react";
import { toast } from "react-toastify";

export default function CommentForm({ onCommentSubmit }) {
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment) {
            toast.error("Please add a comment.");
            return;
        }
        onCommentSubmit(comment);
        setComment("");
    };

    const uploadHandler = (e) => {
        console.log(e.target.files[0]);
    };

    return (
        <div className="mt-5">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700">
                        Your Comment
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        className="mt-1 p-2 w-full border rounded-md"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Photo
                    </label>
                    <input
                        type="file"
                        onChange={(e) => uploadHandler(e)}
                        className="mt-2"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Submit Comment
                    </button>
                </div>
            </form>
        </div>
    );
}
