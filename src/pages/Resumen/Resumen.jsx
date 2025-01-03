import { formatPrice } from '../../utils'

import CardResumen from '../../components/Resumen/CardResumen'
import Link from '../../components/UI/Link/Link'

import {
	CostoEnvioStyled,
	CostoProductoStyled,
	CostoTotalStyled,
	HrStyled,
	ProductsContainerStyled,
	ResumenContainerInfoStyled,
	ResumenContainerStyled,
	ResumenTitleStyled,
} from './ResumenStyles'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getOrders } from '../../axios/axios-orders'
import { useParams } from 'react-router-dom'

const Resumen = () => {
	const [visitedOrder, setVisitedOrder] = useState(null)
	const { currentUser } = useSelector((state) => state.user)
	const { orders } = useSelector((state) => state.orders)
	const dispatch = useDispatch()

	const { orderId } = useParams()

	useEffect(() => {
		if (!orders) {
			getOrders(dispatch, currentUser)
			return
		}

		if (Array.isArray(orders)) {
			const order = orders.find((order) => order._id === orderId)
			setVisitedOrder(order || null)
		}
	}, [orderId, currentUser, orders, dispatch])

	return (
		<ResumenContainerStyled>
			<ResumenTitleStyled>
				<h1>Resumen Orden: #{visitedOrder?._id.slice(-7)}</h1>
				<Link borderRadius="20" to="/mis-ordenes"></Link>
			</ResumenTitleStyled>
			<h2>Productos:</h2>
			<ProductsContainerStyled>
				{visitedOrder?.items.map((item) => (
					<CardResumen key={item._id} {...item} />
				))}
			</ProductsContainerStyled>
			<HrStyled />
			<ResumenContainerInfoStyled>
				<h3>Costos:</h3>
				<CostoProductoStyled>
					<p>Costo de productos</p>
					<span>{formatPrice(visitedOrder?.price)}</span>
				</CostoProductoStyled>
				<CostoEnvioStyled>
					<p>Costo de envío</p>
					<span>{formatPrice(visitedOrder?.shippingCost)}</span>
				</CostoEnvioStyled>
				<CostoTotalStyled>
					<p>Total</p>
					<span>{formatPrice(visitedOrder?.total)}</span>
				</CostoTotalStyled>
			</ResumenContainerInfoStyled>
		</ResumenContainerStyled>
	)
}

export default Resumen
