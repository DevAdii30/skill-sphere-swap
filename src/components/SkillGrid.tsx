import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillCard } from './SkillCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Filter, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '',
    location: 'San Francisco, CA',
    rating: 4.8,
    skillsOffered: ['React', 'TypeScript', 'UI/UX Design'],
    skillsWanted: ['Photography', 'Spanish'],
    availability: 'Weekends',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    avatar: '',
    location: 'Austin, TX',
    rating: 4.9,
    skillsOffered: ['Photography', 'Video Editing', 'Adobe Creative Suite'],
    skillsWanted: ['Python', 'Data Analysis'],
    availability: 'Evenings',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emily Watson',
    avatar: '',
    location: 'Remote',
    rating: 4.7,
    skillsOffered: ['Spanish', 'French', 'Content Writing'],
    skillsWanted: ['React', 'Web Development'],
    availability: 'Flexible',
    isOnline: true,
  },
  {
    id: '4',
    name: 'David Park',
    avatar: '',
    location: 'Seattle, WA',
    rating: 4.6,
    skillsOffered: ['Python', 'Machine Learning', 'Data Science'],
    skillsWanted: ['Guitar', 'Music Production'],
    availability: 'Weekends',
    isOnline: true,
  },
];

const popularSkills = ['React', 'Python', 'Photography', 'Spanish', 'UI/UX Design', 'Data Science', 'Marketing'];

export function SkillGrid() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const { toast } = useToast();

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = selectedSkill === '' || 
      user.skillsOffered.includes(selectedSkill) ||
      user.skillsWanted.includes(selectedSkill);
    
    const matchesAvailability = availabilityFilter === '' || 
      user.availability === availabilityFilter;

    return matchesSearch && matchesSkill && matchesAvailability;
  });

  const handleRequestSwap = (userId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to send swap requests.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
  };

  const handleSkillClick = (skill: string) => {
    setSelectedSkill(skill);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkill('');
    setAvailabilityFilter('');
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Amazing <span className="bg-gradient-primary bg-clip-text text-transparent">Skills</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with talented individuals and start your skill exchange journey today.
          </p>
        </div>

        {/* Popular Skills */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Popular Skills</h3>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkill === skill ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleSkillClick(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 shadow-card mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekends">Weekends</SelectItem>
                <SelectItem value="Evenings">Evenings</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || selectedSkill || availabilityFilter) && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {(selectedSkill || availabilityFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedSkill && (
                <Badge variant="default" className="flex items-center gap-1">
                  Skill: {selectedSkill}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setSelectedSkill('')}
                  />
                </Badge>
              )}
              {availabilityFilter && (
                <Badge variant="default" className="flex items-center gap-1">
                  Availability: {availabilityFilter}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setAvailabilityFilter('')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} members
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <SkillCard
              key={user.id}
              user={user}
              onRequestSwap={handleRequestSwap}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No members found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find more results.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}