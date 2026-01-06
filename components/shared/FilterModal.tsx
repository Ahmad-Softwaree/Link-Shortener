"use client";

import { Button } from "../ui/button";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { useModalStore } from "@/lib/store/modal.store";
import { useTranslation } from "react-i18next";
import { Label } from "../ui/label";
import { ENUMs } from "@/lib/enums";

const FilterModal = () => {
  const { closeModal } = useModalStore();
  const { t } = useTranslation();
  const { queries, setQueries } = useAppQueryParams();

  const handleClearFilters = () => {
    setQueries({
      [ENUMs.PARAMS.STATUS]: "",
      [ENUMs.PARAMS.SEARCH]: "",
    });
    closeModal();
  };

  const handleApply = () => {
    closeModal();
  };

  return (
    <div className="mt-4 space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filter.status")}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={queries.status === "" ? "default" : "outline"}
            onClick={() => setQueries({ [ENUMs.PARAMS.STATUS]: "" })}
            className="w-full">
            {t("filter.all")}
          </Button>
          <Button
            variant={
              queries.status === ENUMs.LINK_STATUS.ACTIVE
                ? "default"
                : "outline"
            }
            onClick={() =>
              setQueries({ [ENUMs.PARAMS.STATUS]: ENUMs.LINK_STATUS.ACTIVE })
            }
            className="w-full">
            {t("filter.active")}
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="flex-1">
          {t("form.cancel")}
        </Button>
        <Button onClick={handleApply} className="flex-1">
          {t("form.submit")}
        </Button>
      </div>
    </div>
  );
};

export default FilterModal;
