import { useMapState } from '@/contexts/map-context';
import { useCreateComplaint } from '@workspace/api-client-react';
import { X, MapPin, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { ComplaintInputCategory } from '@workspace/api-client-react';

const formSchema = z.object({
  category: z.enum(['road', 'water', 'garbage', 'drainage', 'electricity', 'other'] as const),
  description: z.string().min(10, 'Please provide at least 10 characters detailing the issue.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ReportProblemModal() {
  const { isReportModalOpen, setIsReportModalOpen, userLocation } = useMapState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createComplaint = useCreateComplaint();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'road',
      description: '',
    },
  });

  if (!isReportModalOpen) return null;

  const onSubmit = (data: FormValues) => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please allow location access to report a problem.",
        variant: "destructive"
      });
      return;
    }

    createComplaint.mutate(
      {
        data: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          category: data.category as ComplaintInputCategory,
          description: data.description,
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Report Submitted",
            description: "Your grievance has been recorded and will be verified.",
          });
          queryClient.invalidateQueries({ queryKey: ['/api/map/stats'] });
          queryClient.invalidateQueries({ queryKey: ['/api/map/clusters'] });
          queryClient.invalidateQueries({ queryKey: ['/api/map/heatmap'] });
          setIsReportModalOpen(false);
          form.reset();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to submit report. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const categories = [
    { id: 'road', label: 'Road' },
    { id: 'water', label: 'Water' },
    { id: 'garbage', label: 'Garbage' },
    { id: 'drainage', label: 'Drainage' },
    { id: 'electricity', label: 'Power' },
    { id: 'other', label: 'Other' },
  ] as const;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-card border border-white/10 sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-[100%] duration-300">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white tracking-tight">Report Problem</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsReportModalOpen(false)} className="text-white/60 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-6">
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 font-medium">Issue Category</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => field.onChange(cat.id)}
                          className={cn(
                            "py-2.5 px-2 rounded-xl text-sm font-medium transition-all border",
                            field.value === cat.id 
                              ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the issue in detail..." 
                      className="resize-none bg-black/40 border-white/10 text-white focus-visible:ring-primary h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 text-sm p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-200">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Your current location will be attached to this report.</span>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold shadow-lg" 
              disabled={createComplaint.isPending}
            >
              {createComplaint.isPending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
              ) : "Submit Report"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
