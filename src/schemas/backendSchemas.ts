
/**
 * Backend Schemas
 * 
 * This file documents all data structures and objects that are exchanged
 * between the frontend and backend. Use this as a reference when implementing
 * your Django backend models and serializers.
 */

/**
 * Product Schema
 * Represents a product in the e-commerce store
 */
export interface ProductSchema {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/**
 * CartItem Schema
 * Represents a product in the shopping cart with quantity
 */
export interface CartItemSchema extends ProductSchema {
  quantity: number;
}

/**
 * ShippingAddress Schema
 * Contains customer shipping information
 */
export interface ShippingAddressSchema {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/**
 * Order Status Types
 * Possible statuses for an order
 */
export type OrderStatusType = 'pending' | 'processing' | 'delivered' | 'cancelled';

/**
 * Order Schema - Create
 * Object sent to backend when creating a new order (without ID)
 */
export interface CreateOrderSchema {
  date: string;
  status: OrderStatusType;
  items: CartItemSchema[];
  total: number;
  shippingAddress?: ShippingAddressSchema;
}

/**
 * Order Schema - Full
 * Complete order object including ID (returned from backend)
 */
export interface OrderSchema extends CreateOrderSchema {
  id: string;
}

/**
 * Order Status Update Schema
 * Object sent when updating an order's status
 */
export interface OrderStatusUpdateSchema {
  status: OrderStatusType;
}

/**
 * Category Schema
 * Simple string representation of product categories
 */
export type CategorySchema = string;

/**
 * Django Model Equivalents
 * 
 * Below are suggested Django model structures that would map to these schemas.
 * These can be used as a reference when implementing your Django models.
 * 
 * ```python
 * # Product Model
 * class Product(models.Model):
 *     title = models.CharField(max_length=255)
 *     price = models.DecimalField(max_digits=10, decimal_places=2)
 *     description = models.TextField()
 *     category = models.CharField(max_length=100)
 *     image = models.URLField()
 *     rating_rate = models.DecimalField(max_digits=3, decimal_places=1)
 *     rating_count = models.IntegerField()
 * 
 * # Order Model
 * class Order(models.Model):
 *     STATUS_CHOICES = [
 *         ('pending', 'Pending'),
 *         ('processing', 'Processing'),
 *         ('delivered', 'Delivered'),
 *         ('cancelled', 'Cancelled'),
 *     ]
 *     date = models.DateTimeField(auto_now_add=True)
 *     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
 *     total = models.DecimalField(max_digits=10, decimal_places=2)
 *     name = models.CharField(max_length=255)
 *     street = models.CharField(max_length=255)
 *     city = models.CharField(max_length=100)
 *     state = models.CharField(max_length=100)
 *     zip = models.CharField(max_length=20)
 *     country = models.CharField(max_length=100)
 * 
 * # OrderItem Model
 * class OrderItem(models.Model):
 *     order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
 *     product = models.ForeignKey(Product, on_delete=models.CASCADE)
 *     quantity = models.IntegerField(default=1)
 *     price = models.DecimalField(max_digits=10, decimal_places=2)
 * ```
 */
