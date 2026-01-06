import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ActionModalProps } from "@/types/global";
import { Button } from "../ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import useCheckDeletedPage from "@/hooks/useCheckDeletedPage";
import { useSelectedRowsStore } from "@/lib/store/rows.store";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/lib/store/modal.store";

const ActionTooltip = ({
  action_modal_props,
  id,
  action_bar = false,
}: {
  action_modal_props: ActionModalProps;
  id?: number;
  action_bar?: boolean;
}) => {
  const { selectedRows } = useSelectedRowsStore();
  const { i18n } = useTranslation();
  const { openModal } = useModalStore();
  const { deleted } = useCheckDeletedPage();
  let Icon = !deleted ? Trash2 : RotateCcw;
  return (
    <Tooltip>
      <TooltipTrigger
        className="w-full max-w-[200px]"
        disabled={selectedRows.length != 0 && !action_bar}
        onClick={() => {
          openModal({
            type: !deleted ? "delete" : "restore",
            id,
            modalProps: {
              ...action_modal_props,
              type: !deleted ? "delete" : "restore",
              state: !deleted ? "soft_delete" : "restore",
            },
          });
        }}>
        <Button
          className="w-full"
          disabled={selectedRows.length != 0 && !action_bar}
          variant={!deleted ? "destructive" : "default"}
          title={i18n.t(`tooltip.${!deleted ? "delete" : "restore"}` as any)}>
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {i18n.t(`tooltip.${!deleted ? "delete" : "restore"}` as any)}
      </TooltipContent>
    </Tooltip>
  );
};

export default ActionTooltip;
