
from django.db import models

# Product Model - Matches the frontend schema
class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=100)
    image = models.URLField()
    rating_rate = models.DecimalField(max_digits=3, decimal_places=1)
    rating_count = models.IntegerField()
    
    def __str__(self):
        return self.title
    
    @property
    def rating(self):
        """Returns rating in the format expected by the frontend"""
        return {
            'rate': self.rating_rate,
            'count': self.rating_count
        }

# Order Model - Matches the frontend schema
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    id = models.CharField(primary_key=True, max_length=100)  # Using string ID to match frontend
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Shipping address fields
    name = models.CharField(max_length=255, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"Order {self.id}"
    
    @property
    def shippingAddress(self):
        """Returns shipping address in the format expected by the frontend"""
        if not self.name:  # If no shipping info
            return None
        
        return {
            'name': self.name,
            'street': self.street,
            'city': self.city,
            'state': self.state,
            'zip': self.zip,
            'country': self.country
        }

# OrderItem Model - Represents items in an order
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product_id = models.IntegerField()
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=100)
    image = models.URLField()
    rating_rate = models.DecimalField(max_digits=3, decimal_places=1)
    rating_count = models.IntegerField()
    quantity = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.quantity} x {self.title} in Order {self.order.id}"
    
    @property
    def rating(self):
        """Returns rating in the format expected by the frontend"""
        return {
            'rate': self.rating_rate,
            'count': self.rating_count
        }
