import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAuditSchema, type InsertAudit } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

interface AuditFormProps {
  onSubmit: (data: InsertAudit) => void;
  isLoading?: boolean;
}

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const { t } = useI18n();
  
  const form = useForm<InsertAudit>({
    resolver: zodResolver(insertAuditSchema),
    defaultValues: {
      auditType: "monthly",
      auditorName: "",
      startDate: new Date().toISOString(),
      notes: "",
      discrepancies: [],
    },
  });

  const handleSubmit = (data: InsertAudit) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("audits.start_new")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="auditType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("audits.audit_type")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">{t("audits.monthly")}</SelectItem>
                      <SelectItem value="spot">{t("audits.spot_check")}</SelectItem>
                      <SelectItem value="compliance">{t("audits.compliance")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auditorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("audits.auditor_name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-cannabis-primary hover:bg-cannabis-dark"
              disabled={isLoading}
            >
              {isLoading ? t("common.loading") : t("audits.begin_audit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
