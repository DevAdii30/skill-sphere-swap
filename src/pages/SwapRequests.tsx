import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSwap } from '@/contexts/SwapContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Trash2, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SwapRequests = () => {
  const { user } = useAuth();
  const { getUserSwapRequests, updateSwapStatus, deleteSwapRequest } = useSwap();
  const { toast } = useToast();

  if (!user) {
    return <div>Please log in to view your swap requests.</div>;
  }

  const { sent, received } = getUserSwapRequests(user.id);

  const handleAccept = (requestId: string) => {
    updateSwapStatus(requestId, 'accepted');
    toast({
      title: "Swap request accepted",
      description: "You can now coordinate with the other user to exchange skills.",
    });
  };

  const handleReject = (requestId: string) => {
    updateSwapStatus(requestId, 'rejected');
    toast({
      title: "Swap request rejected",
      description: "The request has been declined.",
      variant: "destructive",
    });
  };

  const handleComplete = (requestId: string) => {
    updateSwapStatus(requestId, 'completed');
    toast({
      title: "Swap completed",
      description: "Great! Don't forget to leave feedback for your swap partner.",
    });
  };

  const handleDelete = (requestId: string) => {
    deleteSwapRequest(requestId);
    toast({
      title: "Request deleted",
      description: "The swap request has been removed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Swap Requests</h1>
          <p className="text-muted-foreground">
            Manage your skill exchange requests and collaborations
          </p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList>
            <TabsTrigger value="received">
              Received ({received.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({sent.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {received.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No swap requests received yet.</p>
                </CardContent>
              </Card>
            ) : (
              received.map((request) => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={request.fromUserAvatar} />
                          <AvatarFallback>
                            {request.fromUserName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{request.fromUserName}</h3>
                            <Badge variant="secondary" className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Wants to learn <Badge variant="outline">{request.skillOffered}</Badge> in exchange for <Badge variant="secondary">{request.skillRequested}</Badge>
                          </div>
                          {request.message && (
                            <div className="bg-muted/50 p-3 rounded-lg mb-3">
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Message
                              </div>
                              <p className="text-sm">{request.message}</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(request.createdAt)} ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              variant="gradient"
                              onClick={() => handleAccept(request.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          </>
                        )}
                        {request.status === 'accepted' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleComplete(request.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sent.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No swap requests sent yet.</p>
                </CardContent>
              </Card>
            ) : (
              sent.map((request) => (
                <Card key={request.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={request.toUserAvatar} />
                          <AvatarFallback>
                            {request.toUserName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{request.toUserName}</h3>
                            <Badge variant="secondary" className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            You offered <Badge variant="secondary">{request.skillOffered}</Badge> to learn <Badge variant="outline">{request.skillRequested}</Badge>
                          </div>
                          {request.message && (
                            <div className="bg-muted/50 p-3 rounded-lg mb-3">
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Your Message
                              </div>
                              <p className="text-sm">{request.message}</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(request.createdAt)} ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {(request.status === 'pending' || request.status === 'rejected') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(request.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        )}
                        {request.status === 'accepted' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleComplete(request.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SwapRequests;