import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./info-dialogs.scss']
})
export class FeedbackDialogComponent {
  rating = 5;
  category = 'general';
  email = '';
  message = '';

  constructor(
    private dialogRef: MatDialogRef<FeedbackDialogComponent>,
    private notificationService: NotificationService
  ) {}

  setRating(stars: number): void {
    this.rating = stars;
  }

  getRatingTooltip(stars: number): string {
    const tooltips = ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing'];
    return tooltips[stars - 1] || '';
  }

  onSubmit(): void {
    if (!this.message.trim()) {
      return;
    }
    
    // In a real application, you would send this to the backend API here.
    console.log('Feedback submitted:', {
      rating: this.rating,
      category: this.category,
      email: this.email,
      message: this.message
    });
    
    this.notificationService.showSuccess('Thank you for your feedback!');
    this.dialogRef.close(true);
  }
}
