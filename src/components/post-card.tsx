import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostWithRelations } from "@/lib/actions/posts";

interface PostCardProps {
  post: PostWithRelations;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {post.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-xl font-bold leading-tight">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt || post.content.substring(0, 150) + "..."}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {post.categories.map((category) => (
          <Badge key={category.id} variant="secondary">
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
