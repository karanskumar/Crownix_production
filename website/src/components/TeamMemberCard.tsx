import { ImageWithFallback } from './figma/ImageWithFallback';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export function TeamMemberCard({ name, role, bio, image }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 mb-3">{role}</p>
        <p className="text-gray-600">{bio}</p>
      </div>
    </div>
  );
}
