from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Product, Order, OrderItem, User

# Sample view function for what a Product list API might look like
@api_view(['GET'])
def product_list(request):
    """
    List all products, or create a new product.
    """
    if request.method == 'GET':
        products = Product.objects.all()
        data = [{
            'id': product.id,
            'title': product.title,
            'price': product.price,
            'description': product.description,
            'category': product.category,
            'image': product.image,
            'rating': product.rating,
        } for product in products]
        return Response(data)

@api_view(['GET'])
def product_detail(request, pk):
    """
    Retrieve a product by id.
    """
    product = get_object_or_404(Product, pk=pk)
    data = {
        'id': product.id,
        'title': product.title,
        'price': product.price,
        'description': product.description,
        'category': product.category,
        'image': product.image,
        'rating': product.rating,
    }
    return Response(data)

@api_view(['GET'])
def product_categories(request):
    """
    List all unique product categories.
    """
    categories = Product.objects.values_list('category', flat=True).distinct()
    return Response(list(categories))

@api_view(['GET'])
def products_by_category(request, category):
    """
    List all products in a specific category.
    """
    products = Product.objects.filter(category=category)
    data = [{
        'id': product.id,
        'title': product.title,
        'price': product.price,
        'description': product.description,
        'category': product.category,
        'image': product.image,
        'rating': product.rating,
    } for product in products]
    return Response(data)

@api_view(['GET', 'POST'])
def order_list(request):
    """
    List all orders or create a new order.
    """
    if request.method == 'GET':
        orders = Order.objects.all()
        data = []
        
        for order in orders:
            order_items = order.items.all()
            items_data = [{
                'id': item.product_id,
                'title': item.title,
                'price': item.price,
                'description': item.description,
                'category': item.category,
                'image': item.image,
                'rating': item.rating,
                'quantity': item.quantity
            } for item in order_items]
            
            order_data = {
                'id': order.id,
                'date': order.date.isoformat(),
                'status': order.status,
                'total': order.total,
                'items': items_data
            }
            
            if order.shippingAddress:
                order_data['shippingAddress'] = order.shippingAddress
                
            data.append(order_data)
            
        return Response(data)
    
    elif request.method == 'POST':
        # Example of creating an order from request data
        order_data = request.data
        
        # Validate payment info if included
        payment_info = order_data.get('paymentInfo')
        if payment_info:
            # In a real app, you would process the payment here
            # with a payment gateway like Stripe or PayPal
            # For now, we'll assume the payment was successful
            payment_successful = True
            
            if not payment_successful:
                return Response(
                    {'error': 'Payment processing failed'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create the order
        order = Order.objects.create(
            id=order_data.get('id', f"order-{Order.objects.count() + 1}"),
            status=order_data.get('status', 'pending'),
            total=order_data.get('total', 0)
        )
        
        # Add shipping address if present
        shipping_address = order_data.get('shippingAddress')
        if shipping_address:
            order.name = shipping_address.get('name')
            order.street = shipping_address.get('street')
            order.city = shipping_address.get('city')
            order.state = shipping_address.get('state')
            order.zip = shipping_address.get('zip')
            order.country = shipping_address.get('country')
            order.save()
        
        # Create order items
        for item_data in order_data.get('items', []):
            OrderItem.objects.create(
                order=order,
                product_id=item_data.get('id'),
                title=item_data.get('title'),
                price=item_data.get('price'),
                description=item_data.get('description', ''),
                category=item_data.get('category', ''),
                image=item_data.get('image', ''),
                rating_rate=item_data.get('rating', {}).get('rate', 0),
                rating_count=item_data.get('rating', {}).get('count', 0),
                quantity=item_data.get('quantity', 1)
            )
        
        # Return the created order
        response_data = {
            'id': order.id,
            'date': order.date.isoformat(),
            'status': order.status,
            'total': order.total,
            'items': order_data.get('items', [])
        }
        
        if shipping_address:
            response_data['shippingAddress'] = shipping_address
            
        return Response(response_data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def process_payment(request):
    """
    Process a payment for an order.
    """
    payment_data = request.data
    
    # In a real implementation, you would interact with a payment gateway here
    # For this example, we'll simulate a successful payment
    
    # Validate payment data
    required_fields = ['cardNumber', 'expiryDate', 'cvv', 'amount']
    for field in required_fields:
        if field not in payment_data:
            return Response(
                {'error': f'Missing required field: {field}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Simulate payment processing
    # In reality, you would send this data to a payment processor like Stripe
    try:
        # Simulate a successful payment 90% of the time
        import random
        success = random.random() < 0.9
        
        if success:
            # Generate a transaction ID
            import time
            transaction_id = f"TXN{int(time.time())}{random.randint(1000, 9999)}"
            
            return Response({
                'success': True,
                'transactionId': transaction_id,
                'message': 'Payment processed successfully'
            })
        else:
            return Response({
                'success': False,
                'error': 'Payment declined by issuer'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PATCH', 'DELETE'])
def order_detail(request, pk):
    """
    Retrieve, update or delete an order.
    """
    order = get_object_or_404(Order, pk=pk)
    
    if request.method == 'GET':
        order_items = order.items.all()
        items_data = [{
            'id': item.product_id,
            'title': item.title,
            'price': item.price,
            'description': item.description,
            'category': item.category,
            'image': item.image,
            'rating': item.rating,
            'quantity': item.quantity
        } for item in order_items]
        
        data = {
            'id': order.id,
            'date': order.date.isoformat(),
            'status': order.status,
            'total': order.total,
            'items': items_data
        }
        
        if order.shippingAddress:
            data['shippingAddress'] = order.shippingAddress
            
        return Response(data)
    
    elif request.method == 'PATCH':
        # Update order status
        order.status = request.data.get('status', order.status)
        order.save()
        
        return Response({'status': 'Order status updated'})
    
    elif request.method == 'DELETE':
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def cancel_order(request, pk):
    """
    Cancel an order.
    """
    order = get_object_or_404(Order, pk=pk)
    order.status = 'cancelled'
    order.save()
    
    return Response({'status': 'Order cancelled'})

@api_view(['POST'])
@permission_classes([AllowAny])
def user_signup(request):
    """
    Create a new user account with fullName, email, and password.
    """
    data = request.data
    
    # Check if required fields are present
    if not all(k in data for k in ['fullName', 'email', 'password']):
        return Response({'error': 'fullName, email, and password are required'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user with this email already exists
    if User.objects.filter(email=data['email']).exists():
        return Response({'error': 'A user with this email already exists'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Create new user
    try:
        user = User.objects.create_user(
            email=data['email'],
            full_name=data['fullName'],
            password=data['password']
        )
        
        # Create token for the user
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'fullName': user.full_name
            }
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    """
    Authenticate a user with email and password.
    """
    data = request.data
    
    # Check if required fields are present
    if not all(k in data for k in ['email', 'password']):
        return Response({'error': 'Email and password are required'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate user
    user = authenticate(email=data['email'], password=data['password'])
    
    if user:
        # Create or get token
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'fullName': user.full_name
            }
        })
    else:
        return Response({'error': 'Invalid credentials'}, 
                        status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Get the profile of the authenticated user.
    """
    user = request.user
    
    return Response({
        'id': user.id,
        'email': user.email,
        'fullName': user.full_name,
        'dateJoined': user.date_joined
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_list(request):
    """
    Get a list of payment transactions for the authenticated user.
    """
    # In a real implementation, you would retrieve transactions from a Transaction model
    # For now, we'll return mock data based on orders with "success" payment status
    
    # Get orders that belong to the authenticated user
    orders = Order.objects.filter(user=request.user)
    
    transactions = []
    for order in orders:
        # Check if this order has payment information (in a real app, you'd have a proper Transaction model)
        if hasattr(order, 'payment_status') and order.payment_status:
            transactions.append({
                'id': f"txn-{order.id}",
                'date': order.date.isoformat(),
                'amount': float(order.total),
                'status': 'success' if order.status != 'cancelled' else 'failed',
                'paymentMethod': 'Credit Card',  # In a real app, store the actual payment method
                'orderId': order.id
            })
    
    # If you don't have any orders with payments in development, 
    # you can uncomment this to return mock data
    if not transactions:
        import random
        import time
        from datetime import datetime, timedelta
        
        for i in range(5):
            random_days = random.randint(1, 30)
            date = datetime.now() - timedelta(days=random_days)
            
            transactions.append({
                'id': f"txn-{int(time.time())}-{i}",
                'date': date.isoformat(),
                'amount': round(random.uniform(10, 200), 2),
                'status': random.choice(['success', 'success', 'success', 'failed', 'pending']),
                'paymentMethod': 'Credit Card',
                'orderId': f"order-{int(time.time())}-{i}" if random.random() > 0.3 else None
            })
        
        # Sort by date, most recent first
        transactions.sort(key=lambda x: x['date'], reverse=True)
    
    return Response(transactions)
