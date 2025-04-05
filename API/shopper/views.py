
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product, Order, OrderItem

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
