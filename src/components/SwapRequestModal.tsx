import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useSwap } from '@/contexts/SwapContext';
import { useToast } from '@/hooks/use-toast';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    name: string;
    avatar?: string;
    skillsOffered: string[];
  };
}

export function SwapRequestModal({ isOpen, onClose, targetUser }: SwapRequestModalProps) {
  const { user } = useAuth();
  const { sendSwapRequest } = useSwap();
  const { toast } = useToast();
  const [selectedSkillOffered, setSelectedSkillOffered] = useState('');
  const [selectedSkillRequested, setSelectedSkillRequested] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to send swap requests.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSkillOffered || !selectedSkillRequested) {
      toast({
        title: "Missing information",
        description: "Please select both skills for the swap.",
        variant: "destructive",
      });
      return;
    }

    sendSwapRequest({
      fromUserId: user.id,
      toUserId: targetUser.id,
      fromUserName: user.name,
      toUserName: targetUser.name,
      fromUserAvatar: user.avatar,
      toUserAvatar: targetUser.avatar,
      skillOffered: selectedSkillOffered,
      skillRequested: selectedSkillRequested,
      message: message.trim()
    });

    toast({
      title: "Swap request sent!",
      description: `Your request has been sent to ${targetUser.name}.`,
    });

    // Reset form
    setSelectedSkillOffered('');
    setSelectedSkillRequested('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Skill Swap</DialogTitle>
          <DialogDescription>
            Send a skill exchange request to {targetUser.name}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-offered">Skill you want to offer</Label>
            <Select value={selectedSkillOffered} onValueChange={setSelectedSkillOffered}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill you can teach" />
              </SelectTrigger>
              <SelectContent>
                {user?.skillsOffered.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-requested">Skill you want to learn</Label>
            <Select value={selectedSkillRequested} onValueChange={setSelectedSkillRequested}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill to learn" />
              </SelectTrigger>
              <SelectContent>
                {targetUser.skillsOffered.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}