import React from "react";
import Image from "next/image";
import ReactStars from "react-stars";

export default function Comments({ comments = [] }) {
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            {comments.length === 0 && <div>No comments yet.</div>}
            {comments.map((comment) => (
                <div key={comment._id} className="mb-6 border-b pb-4">
                    <div className="flex items-center mb-2">
                        <div className="mr-3">
                            {comment.firstName && comment.user.image ? (
                                <Image
                                    src={comment.user.firstName}
                                    alt={comment.user.firstName}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-semibold">
                                        {comment.user.userName[0]}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">
                                {comment.user.name}
                            </h3>
                            <span className="text-sm text-gray-500">
                                {new Date(
                                    comment.createdAt
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <p className="mb-2">{comment.text}</p>
                    {comment.image && (
                        <div className="mb-2">
                            <Image
                                src={comment.image}
                                alt="Comment Image"
                                width={200}
                                height={200}
                            />
                        </div>
                    )}
                    <div className="mb-2 flex items-center gap-2">
                        Rating:{" "}
                        <ReactStars
                            count={5}
                            size={24}
                            color2={"#ffd700"}
                            edit={false} // This makes the stars read-only
                            value={comment.rating}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
