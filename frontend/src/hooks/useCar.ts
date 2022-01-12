import { useContext, useEffect, useRef, useState } from "react";
import { Car, CarContext, CarState, CarType } from "../contexts";
import { RateLimitError } from "../errors";
import { CarService } from "../services";

type CarHooks = CarState & {
  isRequestBlocked: boolean;
  retryAfterInterval: number;
  fetchCars: () => void;
}

export const useCar = (): CarHooks => {
  const { state, dispatch } = useContext(CarContext);

  const [isRequestBlocked, setIsRequestBlocked] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(state.rateLimit?.retryAfter ?? 0);
  const intervalRef = useRef<any>();

  useEffect(() => {
    if (timeLeft <= 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [timeLeft]);

  useEffect(() => {
    if(state.error?.status === 429) {
      setTimeLeft(state.rateLimit?.retryAfter ?? 0);
      setIsRequestBlocked(true);
    } else {
      setIsRequestBlocked(false);
    }
  }, [state.error?.status, state.rateLimit?.retryAfter, setIsRequestBlocked]);

  useEffect(() => {
    if(isRequestBlocked && timeLeft <= 0) {
      setIsRequestBlocked(false);
    }
  }, [timeLeft, isRequestBlocked, setIsRequestBlocked])

  const setLoading = (loading: boolean) => dispatch({
    type: CarType.LOADING,
    payload: { loading }
  });

  const setError = (error: unknown): string | null => {
    let errorStatus = 500;
    const errorMessage = error !== null ? (error as Error).message : null;

    if (error instanceof RateLimitError) {
      errorStatus = error.status;
      dispatch({
        type: CarType.RATE_LIMIT,
        payload: {
          rateLimit: error.rateLimit
        }
      })
    }

    dispatch({
      type: CarType.ERROR,
      payload: {
        error: errorMessage ? { status: errorStatus, message: errorMessage } : null
      }
    });
    return errorMessage;
  };

  const fetchCars = async () => {
    try {
      setLoading(true);

      const { data: cars, ...rateLimit } = await CarService.Fetch<Car>();

      dispatch({
        type: CarType.SET,
        payload: { cars }
      });

      dispatch({
        type: CarType.RATE_LIMIT,
        payload: {
          rateLimit: rateLimit
        }
      });

      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    ...state,
    isRequestBlocked,
    retryAfterInterval: timeLeft,
    fetchCars
  }

}