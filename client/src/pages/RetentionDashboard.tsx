import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, ArrowDown, Link } from "lucide-react";

interface PageVisit {
  id: number;
  sessionId: string;
  page: string;
  durationSeconds: number;
  emailId: number | null;
  email: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  maxScrollPercent: number | null;
  visitedAt: string;
}

interface RetentionStats {
  totalVisits: number;
  uniqueSessions: number;
  avgDurationSeconds: number;
  visits: PageVisit[];
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function RetentionDashboard() {
  const { data, isLoading, error } = useQuery<RetentionStats>({
    queryKey: ["/api/retention/stats"],
    queryFn: async () => {
      const res = await fetch("/api/retention/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const avgScrollPercent = data?.visits.length
    ? Math.round(
        data.visits.reduce((sum, v) => sum + (v.maxScrollPercent ?? 0), 0) /
          data.visits.length
      )
    : 0;

  // Compute UTM source breakdown
  const utmBreakdown = data?.visits.reduce<Record<string, number>>((acc, v) => {
    const source = v.utmSource || "Direct / None";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {}) ?? {};

  const referrerBreakdown = data?.visits.reduce<Record<string, number>>((acc, v) => {
    if (v.referrer) {
      try {
        const host = new URL(v.referrer).hostname;
        acc[host] = (acc[host] || 0) + 1;
      } catch {
        acc[v.referrer] = (acc[v.referrer] || 0) + 1;
      }
    }
    return acc;
  }, {}) ?? {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading retention data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load retention data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8">Retention Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{data?.totalVisits ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Unique Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{data?.uniqueSessions ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Avg. Time on Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {formatDuration(data?.avgDurationSeconds ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Avg. Scroll Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowDown className="w-6 h-6 text-blue-500" />
              <p className="text-4xl font-bold">{avgScrollPercent}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{reviews.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Avg. Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              <p className="text-4xl font-bold">{avgRating}</p>
              <span className="text-muted-foreground text-lg">/ 10</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UTM & Referrer Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Traffic Sources (UTM)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(utmBreakdown).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(utmBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([source, count]) => (
                    <div key={source} className="flex justify-between items-center">
                      <span className="text-sm">{source}</span>
                      <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No UTM data yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(referrerBreakdown).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(referrerBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([host, count]) => (
                    <div key={host} className="flex justify-between items-center">
                      <span className="text-sm">{host}</span>
                      <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No referrer data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Email Filled</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Scroll</TableHead>
                <TableHead>UTM Source</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Visited At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.visits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-mono text-xs">
                    {visit.sessionId.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{visit.page}</TableCell>
                  <TableCell>
                    {visit.email ? (
                      <span className="text-green-600 font-medium">{visit.email}</span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDuration(visit.durationSeconds)}</TableCell>
                  <TableCell>{visit.maxScrollPercent ?? 0}%</TableCell>
                  <TableCell>
                    {visit.utmSource ? (
                      <span className="text-xs">{visit.utmSource}{visit.utmMedium ? ` / ${visit.utmMedium}` : ""}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {visit.referrer ? (
                      <span className="text-xs truncate max-w-[150px] block">{(() => { try { return new URL(visit.referrer).hostname; } catch { return visit.referrer; } })()}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Direct</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(visit.visitedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.visits || data.visits.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No visits recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{review.rating}/10</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No reviews yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
