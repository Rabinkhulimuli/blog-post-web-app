import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppDispatch} from '@/store/hooks';
import { updatePost } from '@/store/slices/post-slice';
import { useState } from 'react';
import PostForm from '@/features/blog-post';

interface DashboardPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  date: string;
  content: string;
  status: string;
  onDelete: (id: string) => void;
}

export default function DashboardPostCard({
  id,
  title,
  excerpt,
  category,
  imageUrl,
  date,
  status,
  content,
  onDelete,
}: DashboardPostCardProps) {
  const[open,setOpen]= useState(false)
  const dispatch = useAppDispatch();
  const handleUpdate = (data: any) => {
    dispatch(updatePost(data));
    setOpen(false)
  };
  return (
    <Card className='hover-elevate overflow-hidden transition-all'>
      <div className='flex flex-col md:flex-row'>
        <div className='h-32  overflow-hidden md:h-auto md:w-48 px-4 '>
          <img
            src={imageUrl}
            alt={title}
            className='h-full w-full object-cover rounded-md aspect-square'
            data-testid={`img-dashboard-post-${id}`}
          />
        </div>

        <div className='flex flex-1 flex-col'>
          <CardContent className='flex-1 pt-6'>
            <div className='mb-2 flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <div className='mb-2 flex items-center gap-2'>
                  <span
                    className='text-primary text-xs font-medium'
                    data-testid={`text-dashboard-category-${id}`}
                  >
                    {category}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                    data-testid={`text-dashboard-status-${id}`}
                  >
                    {status}
                  </span>
                </div>
                <h3
                  className='mb-1 line-clamp-2 font-serif text-lg font-semibold'
                  data-testid={`text-dashboard-title-${id}`}
                >
                  {title}
                </h3>
                <p
                  className='text-muted-foreground line-clamp-2 text-sm'
                  data-testid={`text-dashboard-excerpt-${id}`}
                >
                  {excerpt}
                </p>
              </div>
            </div>
            <p className='text-muted-foreground text-xs' data-testid={`text-dashboard-date-${id}`}>
              {date}
            </p>
          </CardContent>

          <CardFooter className='flex gap-2 border-t pt-4'>
            <Link to={`/post/${id}`} data-testid={`link-view-post-${id}`}>
              <Button variant='outline' size='sm'>
                <Eye className='mr-2 h-4 w-4' />
                View
              </Button>
            </Link>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className='max-h-[90vh] overflow-hidden overflow-y-scroll'>
                <PostForm
                  onSave={data => handleUpdate(data)}
                  initialData={{
                    id,
                    title,
                    excerpt,
                    category,
                    imageUrl,
                    content,
                  }}
                />
              </DialogContent>
            </Dialog>
            
              <Button variant='outline' size='sm'
              onClick={()=> setOpen(!open)}
              >
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onDelete(id)}
              data-testid={`button-delete-post-${id}`}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
