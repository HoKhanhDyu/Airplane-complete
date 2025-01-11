import hashlib
import hmac
import urllib.parse


class VNPAY:
    def __init__(self):
        self.request_data = {}
        self.response_data = {}

    def get_payment_url(self, payment_url, secret_key):
        """
        Generate payment URL with the secure hash.
        """
        query_string = self._build_query_string(self.request_data)
        hash_value = self._generate_hmac(secret_key, query_string)
        return f"{payment_url}?{query_string}&vnp_SecureHash={hash_value}"

    def validate_response(self, secret_key):
        """
        Validate the response using the secure hash.
        """
        vnp_secure_hash = self.response_data.pop('vnp_SecureHash', None)
        self.response_data.pop('vnp_SecureHashType', None)  # Remove if exists

        query_string = self._build_query_string(
            {k: v for k, v in self.response_data.items() if k.startswith('vnp_')}
        )
        hash_value = self._generate_hmac(secret_key, query_string)

        print(
            f"Validate debug:\nHashData: {query_string}\n"
            f"HashValue: {hash_value}\nInputHash: {vnp_secure_hash}"
        )
        return vnp_secure_hash == hash_value

    @staticmethod
    def _generate_hmac(secret_key, data):
        """
        Generate HMAC-SHA512 hash.
        """
        byte_key = secret_key.encode('utf-8')
        byte_data = data.encode('utf-8')
        return hmac.new(byte_key, byte_data, hashlib.sha512).hexdigest()

    @staticmethod
    def _build_query_string(data):
        """
        Build a query string from a dictionary, sorting keys.
        """
        sorted_data = sorted(data.items())
        return "&".join(f"{key}={urllib.parse.quote_plus(str(value))}" for key, value in sorted_data)

class vnpay:
    requestData = {}
    responseData = {}

    def get_payment_url(self, vnpay_payment_url, secret_key):
        inputData = sorted(self.requestData.items())
        queryString = ''
        hasData = ''
        seq = 0
        for key, val in inputData:
            if seq == 1:
                queryString = queryString + "&" + key + '=' + urllib.parse.quote_plus(str(val))
            else:
                seq = 1
                queryString = key + '=' + urllib.parse.quote_plus(str(val))

        hashValue = self.__hmacsha512(secret_key, queryString)
        return vnpay_payment_url + "?" + queryString + '&vnp_SecureHash=' + hashValue

    def validate_response(self, secret_key):
        vnp_SecureHash = self.responseData['vnp_SecureHash']
        # Remove hash params
        if 'vnp_SecureHash' in self.responseData.keys():
            self.responseData.pop('vnp_SecureHash')

        if 'vnp_SecureHashType' in self.responseData.keys():
            self.responseData.pop('vnp_SecureHashType')

        inputData = sorted(self.responseData.items())
        hasData = ''
        seq = 0
        for key, val in inputData:
            if str(key).startswith('vnp_'):
                if seq == 1:
                    hasData = hasData + "&" + str(key) + '=' + urllib.parse.quote_plus(str(val))
                else:
                    seq = 1
                    hasData = str(key) + '=' + urllib.parse.quote_plus(str(val))
        hashValue = self.__hmacsha512(secret_key, hasData)

        print(
            'Validate debug, HashData:' + hasData + "\n HashValue:" + hashValue + "\nInputHash:" + vnp_SecureHash)

        return vnp_SecureHash == hashValue

    @staticmethod
    def __hmacsha512(key, data):
        byteKey = key.encode('utf-8')
        byteData = data.encode('utf-8')
        return hmac.new(byteKey, byteData, hashlib.sha512).hexdigest()
