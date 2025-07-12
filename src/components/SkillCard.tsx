import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SwapRequestModal } from '@/components/SwapRequestModal';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Star, MessageSquare, Clock } from 'lucide-react';

interface SkillCardProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
    rating: number;
    skillsOffered: string[];
    skillsWanted: string[];
    availability: string;
    isOnline: boolean;
  };
  onRequestSwap: (userId: string) => void;
}

export function SkillCard({ user: cardUser, onRequestSwap }: SkillCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestSwap = () => {
    if (!isAuthenticated) {
      onRequestSwap(cardUser.id);
      return;
    }
    setIsModalOpen(true);
  };
  return (
    <Card className="h-full bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 group">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={cardUser.avatar} alt={cardUser.name} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {cardUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {cardUser.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate">{cardUser.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              {cardUser.location && (
                <>
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{cardUser.location}</span>
                </>
              )}
            </div>
            <div className="flex items-center mt-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
              <span className="text-sm text-muted-foreground">{cardUser.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skills Offered */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">Offers</h4>
          <div className="flex flex-wrap gap-1">
            {cardUser.skillsOffered.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {cardUser.skillsOffered.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{cardUser.skillsOffered.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div>
          <h4 className="text-sm font-medium text-card-foreground mb-2">Wants</h4>
          <div className="flex flex-wrap gap-1">
            {cardUser.skillsWanted.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs border-accent text-accent">
                {skill}
              </Badge>
            ))}
            {cardUser.skillsWanted.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{cardUser.skillsWanted.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" />
          <span>{cardUser.availability}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          variant="gradient" 
          className="w-full"
          onClick={handleRequestSwap}
          disabled={user?.id === cardUser.id}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {user?.id === cardUser.id ? 'Your Profile' : 'Request Swap'}
        </Button>
      </CardFooter>

      <SwapRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetUser={cardUser}
      />
    </Card>
  );
}