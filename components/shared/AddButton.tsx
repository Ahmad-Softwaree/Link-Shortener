import { CircleFadingPlus } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/lib/store/modal.store";

const AddButton = ({ onClick }: { onClick?: () => void }) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  return (
    <Button
      title="addForm"
      type="button"
      onClick={onClick ? onClick : () => openModal({ type: "add" })}
      className="flex flex-row cursor-pointer items-center justify-center gap-2 p-2 px-4 text-sm rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
      <CircleFadingPlus className="h-5 w-5" />
      <p className="font-semibold">{t("link.create")}</p>
    </Button>
  );
};

export default AddButton;
