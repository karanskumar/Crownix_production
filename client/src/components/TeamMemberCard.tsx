import { ImageWithFallback } from './figma/ImageWithFallback';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export function TeamMemberCard({ name, role, bio, image }: TeamMemberCardProps) {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-card-border">
      <div className="aspect-square overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-card-foreground mb-1 font-medium">{name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{role}</p>
        <p className="text-muted-foreground text-sm">{bio}</p>
      </div>
    </div>
  );
}
