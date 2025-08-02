import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { AuditForm } from "@/components/audits/audit-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { indexedDBService } from "@/lib/indexeddb";
import type { Audit, InsertAudit } from "@shared/schema";

export default function Audits() {
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: audits = [] } = useQuery<Audit[]>({
    queryKey: ["/api/audits"],
  });

  const createAuditMutation = useMutation({
    mutationFn: async (data: InsertAudit) => {
      try {
        const response = await apiRequest("POST", "/api/audits", data);
        const audit = await response.json();
        await indexedDBService.saveAudit(audit);
        return audit;
      } catch (error) {
        // If server fails, save to IndexedDB only
        const audit: Audit = {
          ...data,
          id: crypto.randomUUID(),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        await indexedDBService.saveAudit(audit);
        return audit;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/audits"] });
      toast({ title: t("common.success"), description: "Audit created successfully" });
    },
    onError: (error) => {
      toast({ title: t("common.error"), description: error.message, variant: "destructive" });
    },
  });

  const sortedAudits = audits.sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const handleAuditSubmit = (data: InsertAudit) => {
    createAuditMutation.mutate(data);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <h2 className="text-xl font-semibold text-gray-800">{t("audits.title")}</h2>

      {/* Start New Audit */}
      <AuditForm
        onSubmit={handleAuditSubmit}
        isLoading={createAuditMutation.isPending}
      />

      {/* Audit History */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">{t("audits.history")}</h3>
          <div className="space-y-3">
            {sortedAudits.length === 0 ? (
              <p className="text-gray-500 text-sm">No audits recorded yet</p>
            ) : (
              sortedAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      {audit.auditType === "monthly" 
                        ? t("audits.monthly")
                        : audit.auditType === "spot" 
                        ? t("audits.spot_check")
                        : t("audits.compliance")
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(audit.startDate).toLocaleDateString()} - {audit.auditorName}
                    </p>
                    {audit.notes && (
                      <p className="text-sm text-gray-500 mt-1">{audit.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusVariant(audit.status)}>
                      {getStatusLabel(audit.status)}
                    </Badge>
                    {audit.discrepancies.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {audit.discrepancies.length} discrepancies
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
