import { useState } from "react";
import { toast } from "react-toastify";
import ReactStars from "react-stars";

export default function CommentForm({ onCommentSubmit }) {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0); // New state for rating

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment) {
            toast.error("Please add a comment.");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        onCommentSubmit({ comment, rating }); // Pass both comment and rating
        setComment("");
        setRating(0);
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
                        Rating
                    </label>
                    <ReactStars
                        count={5}
                        size={24}
                        color2={"#ffd700"}
                        onChange={(newRating) => setRating(newRating)}
                        value={rating}
                    />
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
