"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../atoms/Modal";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    itemTitle?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    itemTitle,
    isLoading,
}: DeleteConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-danger/5 border border-danger/10 rounded-2xl">
                    <div className="p-2 bg-danger/10 rounded-full text-danger">
                        <AlertTriangle size={24} />
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                        Are you sure you want to delete <span className="text-neutral-900 font-bold">{itemTitle || "this event"}</span>?
                        This action cannot be undone and all reservations for this event will be canceled.
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl bg-danger text-white font-semibold hover:bg-danger-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? "Deleting..." : "Delete Event"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
