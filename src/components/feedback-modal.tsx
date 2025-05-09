
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, MessageSquareText } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comments: string) => void;
}

export function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    onSubmit(rating, comments);
    // Reset state for next time
    setRating(0);
    setComments('');
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset state if closed without submitting
      setRating(0);
      setComments('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary flex items-center">
            <MessageSquareText className="mr-2 h-7 w-7" />
            We&apos;d Love Your Feedback!
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground pt-2">
            Thank you for your purchase. Please take a moment to tell us about your experience with cœzii.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div>
            <Label htmlFor="rating" className="text-xl font-semibold text-card-foreground mb-2 block">
              How would you rate your overall experience?
            </Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Button
                  key={starValue}
                  variant="ghost"
                  size="icon"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                  aria-label={`Rate ${starValue} out of 5 stars`}
                >
                  <Star
                    className={`h-8 w-8 transition-colors duration-150 ${
                      (hoverRating || rating) >= starValue
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted-foreground/50 hover:text-yellow-300'
                    }`}
                  />
                </Button>
              ))}
            </div>
            {rating > 0 && <p className="text-sm text-muted-foreground mt-1">You selected {rating} out of 5 stars.</p>}
          </div>

          <div>
            <Label htmlFor="comments" className="text-xl font-semibold text-card-foreground mb-2 block">
              Any comments or suggestions? (Optional)
            </Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us what you think..."
              className="min-h-[100px] text-base bg-input focus:ring-accent"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto text-lg">
            Skip
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={rating === 0} // Require at least a rating to submit
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 text-lg"
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
