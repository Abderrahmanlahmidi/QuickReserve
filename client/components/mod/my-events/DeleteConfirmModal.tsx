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
                <div className="flex items-center space-x-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <div className="p-2 bg-red-500/20 rounded-full text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <p className="text-neutral-300 text-sm">
                        Are you sure you want to delete <span className="text-white font-semibold">{itemTitle || "this event"}</span>?
                        This action cannot be undone and all reservations for this event will be canceled.
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20"
                    >
                        {isLoading ? "Deleting..." : "Delete Event"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
