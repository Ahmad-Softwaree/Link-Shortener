"use client";

import { useModalStore } from "@/lib/store/modal.store";
import { useTranslation } from "react-i18next";
import Modal from "@/components/shared/Modal";
import { LinkForm } from "@/components/forms/LinkForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteLink } from "@/lib/react-query/queries/links.query";
import FilterModal from "@/components/shared/FilterModal";

export function ModalManager() {
  const { modal, closeModal, modalData } = useModalStore();
  const { t } = useTranslation();
  const deleteMutation = useDeleteLink({
    successMessage: t("toast.link_deleted"),
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(modalData.id);
    closeModal();
  };

  if (modal === "add") {
    return (
      <Modal
        title={t("form.create_title")}
        description={t("form.create_description")}>
        <LinkForm state="insert" />
      </Modal>
    );
  }

  if (modal === "update") {
    return (
      <Modal
        title={t("form.update_title")}
        description={t("form.update_description")}>
        <LinkForm state="update" />
      </Modal>
    );
  }

  if (modal === "delete") {
    return (
      <AlertDialog open={true} onOpenChange={closeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirm.delete_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirm.delete_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("confirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? "..." : t("confirm.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (modal === "filter") {
    return (
      <Modal title={t("filter.status")}>
        <FilterModal />
      </Modal>
    );
  }

  return null;
}
