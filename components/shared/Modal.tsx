"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/lib/store/modal.store";
import { useState } from "react";

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}
export type ModalTypes =
  | "add"
  | "delete"
  | "restore"
  | "update"
  | "filter"
  | "info"
  | "warning";

function Modal({
  open,
  onOpenChange,
  children,
  title,
  description,
  maxWidth = "!max-w-2xl",
}: ModalProps) {
  const { closeModal } = useModalStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialMousePosition, setInitialMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
    setInitialPosition({ x: position.x, y: position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaMove = {
        x: e.clientX - initialMousePosition.x,
        y: e.clientY - initialMousePosition.y,
      };
      setPosition({
        x: initialPosition.x + deltaMove.x,
        y: initialPosition.y + deltaMove.y,
      });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  return (
    <Dialog open={open || true} onOpenChange={onOpenChange || closeModal}>
      <DialogContent
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        className={`overflow-y-auto max-h-[80vh]  w-full ${maxWidth}`}>
        {(title || description) && (
          <DialogHeader
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
