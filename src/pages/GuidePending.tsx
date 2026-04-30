import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Hourglass } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const GuidePending = () => {
  const { user, guideStatus, signOut, refresh } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 shadow-deep text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-muted grid place-items-center mb-4">
          <Hourglass className="w-6 h-6 text-accent" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">
          {guideStatus === "rejected" ? "Application not approved" : "Application under review"}
        </h1>
        <p className="text-foreground-dim text-sm mb-6">
          {guideStatus === "rejected"
            ? "We weren't able to approve your guide profile at this time. Contact our team for next steps."
            : "Thanks for registering as a guide. Our team is reviewing your credentials. You'll be notified by email once your profile is approved and goes live in the directory."}
        </p>
        <Button variant="hunt" className="w-full mb-3" asChild>
          <Link to="/guide-profile">Edit profile</Link>
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={refresh}>Refresh</Button>
          <Button variant="ghost" className="flex-1" onClick={async () => { await signOut(); navigate("/"); }}>Sign out</Button>
        </div>
        <p className="text-[11px] text-foreground-dim mt-6">Signed in as {user?.email}</p>
      </div>
    </div>
  );
};

export default GuidePending;
